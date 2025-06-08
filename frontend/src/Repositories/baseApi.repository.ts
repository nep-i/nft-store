import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
// import { RootOptions } from "react-dom/client";
import { RepositoryFactory } from "./factory.repository";
import { DocumentNode } from "@apollo/client";

import log from "loglevel";

import store from "../Store/store";
import { response } from "express";
import { KeycloakInstance } from "keycloak-js";
import { Buffer } from "buffer";

export abstract class BaseApiRepository {
  axiosInstance: AxiosInstance;
  publicAxiosInstance: AxiosInstance;

  static getTheKeycloakFromTheStore = (): KeycloakInstance => {
    return store.getState().auth.keycloak;
  };

  abstract id: string;
  abstract endpoint: string;

  constructor() {
    const apiConfig = RepositoryFactory.getUrl();

    this.axiosInstance = axios.create({
      baseURL: apiConfig.baseUrl + "/" + apiConfig.apiSuffix,
    });

    this.publicAxiosInstance = axios.create({
      baseURL: apiConfig.baseUrl + "/" + apiConfig.apiSuffix,
    });

    this.axiosInstance.interceptors.request.use(
      async (requestConfig: InternalAxiosRequestConfig<any>) => {
        try {
          const token = BaseApiRepository.getTheKeycloakFromTheStore().token;
          if (token) requestConfig.headers.Authorization = `Bearer ${token}`;
          else {
            log.error("There is no token in interceptor");
          }
        } catch (error) {
          log.error("Something went wrong with gtting token");
        }

        return requestConfig;
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: any) => {
        if (error.response && error.response.status === 401) {
          try {
            await BaseApiRepository.getTheKeycloakFromTheStore().updateToken(3);
            const token = BaseApiRepository.getTheKeycloakFromTheStore().token;
            const config = error.config;
            config.header.Authorization = `Bearer ${token}`;
            return this.axiosInstance(config);
          } catch (error) {
            log.error("BaseApiRepository error", error);
          }
        }
        return Promise.reject(error);
      }
    );
  }
  model: any;

  private callIsPublic(isPublic: boolean): AxiosInstance {
    return isPublic ? this.publicAxiosInstance : this.axiosInstance;
  }

  public get(
    endpoint: string,
    config: AxiosRequestConfig = {},
    publicCall: boolean = false
  ): Promise<any> {
    return this.callIsPublic(publicCall)
      .get(endpoint, config)
      .then((result) => {
        return result.data;
      });
  }

  public post(
    endpoint: string,
    data: any,
    config: AxiosRequestConfig = {},
    isPublic: boolean = false
  ): Promise<any> {
    return this.callIsPublic(isPublic)
      .post(endpoint, data, config)
      .then((result: AxiosResponse) => {
        return result.data;
      });
  }

  public patch(
    endpoint: string,
    data: any,
    config: AxiosRequestConfig = {}
  ): Promise<any> {
    return this.axiosInstance
      .patch(endpoint, data, config)
      .then((result: AxiosResponse) => {
        return result.data;
      });
  }

  public delete(endpoint: string): Promise<any> {
    return this.axiosInstance.delete(endpoint).then((result: AxiosResponse) => {
      return result.data;
    });
  }

  public getFile(
    endpoint: string,
    config: AxiosRequestConfig = {}
  ): Promise<any> {
    config = { ...config, responseType: "arraybuffer" };
    return this.axiosInstance
      .get(endpoint, config)
      .then((result: AxiosResponse) => {
        return Buffer.from(result.data, "binary").toString("base64");
      });
  }
}
