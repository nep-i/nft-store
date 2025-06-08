import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloError,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Observable } from "@apollo/client/utilities";
import { DocumentNode, gql } from "@apollo/client";
import log from "loglevel";
import store from "../Store/store";
import { KeycloakInstance } from "keycloak-js";
import { RepositoryFactory } from "./factory.repository";
import { RepoParams, FilterObject } from "../Interfaces/repoParams.interface";
import { BaseModel } from "../Models/base.model";
import _ from "lodash";
import { IBaseRepository } from "../Interfaces/baseRepository.interface";
import { AxiosRequestConfig } from "axios";
import { createContext } from "react";

// BaseApiRepository: Configures Apollo Client for GraphQL with Keycloak authentication
export abstract class BaseApolloRepository {
  protected apolloClient: ApolloClient<any>;
  protected publicApolloClient: ApolloClient<any>;
  protected static getTheKeycloakFromTheStore = (): KeycloakInstance => {
    return store.getState().auth.keycloak;
  };
  abstract id: string;

  constructor() {
    const apiConfig = RepositoryFactory.getUrl();
    const httpLink = new HttpLink({
      uri: `${apiConfig.baseUrl}/${apiConfig.apiSuffix}`,
    });

    // Authenticated client with Keycloak token
    const authLink = setContext(async (_: any, { headers }: any) => {
      try {
        const token = BaseApolloRepository.getTheKeycloakFromTheStore().token;
        if (!token) {
          log.error("No token in Apollo interceptor");
          return { headers };
        }
        return {
          headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
          },
        };
      } catch (error) {
        log.error("Error getting token:", error);
        return { headers };
      }
    });

    this.apolloClient = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });

    // Public client without authentication
    this.publicApolloClient = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
    });
  }

  endpoint!: string;
  model: any;

  public async query<T>(
    document: DocumentNode,
    variables: any,
    isPublic: boolean = false
  ): Promise<T> {
    const client = isPublic ? this.publicApolloClient : this.apolloClient;
    try {
      const { data, errors } = await client.query({
        query: document,
        variables,
      });
      if (errors) {
        throw new ApolloError({ graphQLErrors: errors });
      }
      return data;
    } catch (error: any) {
      if (
        error instanceof ApolloError &&
        error.networkError?.statusCode === 401
      ) {
        try {
          await BaseApolloRepository.getTheKeycloakFromTheStore().updateToken(
            3
          );
          const { data, errors } = await client.query({
            query: document,
            variables,
          });
          if (errors) {
            throw new ApolloError({ graphQLErrors: errors });
          }
          return data;
        } catch (refreshError) {
          log.error("Token refresh failed:", refreshError);
          throw refreshError;
        }
      }
      throw error;
    }
  }

  public async mutate<T>(
    document: DocumentNode,
    variables: any,
    isPublic: boolean = false
  ): Promise<T> {
    const client = isPublic ? this.publicApolloClient : this.apolloClient;
    try {
      const { data, errors } = await client.mutate({
        mutation: document,
        variables,
      });
      if (errors) {
        throw new ApolloError({ graphQLErrors: errors });
      }
      return data;
    } catch (error: any) {
      if (
        error instanceof ApolloError &&
        error.networkError?.statusCode === 401
      ) {
        try {
          await BaseApolloRepository.getTheKeycloakFromTheStore().updateToken(
            3
          );
          const { data, errors } = await client.mutate({
            mutation: document,
            variables,
          });
          if (errors) {
            throw new ApolloError({ graphQLErrors: errors });
          }
          return data;
        } catch (refreshError) {
          log.error("Token refresh failed:", refreshError);
          throw refreshError;
        }
      }
      throw error;
    }
  }

  public subscribe<T>(
    document: DocumentNode,
    variables: any,
    isPublic: boolean = false
  ): Observable<T> {
    const client = isPublic ? this.publicApolloClient : this.apolloClient;
    return client.subscribe({
      query: document,
      variables,
    });
  }
}
