import { RepoParams } from "./repoParams.interface";
import { DocumentNode } from "@apollo/client";
import { AxiosRequestConfig } from "axios";
import { Observable } from "@apollo/client/utilities";

export interface IBaseRepository<T> {
  id: string;
  endpoint: string;
  model: any; // Consider replacing 'any' with a specific model type
  get?(
    endpoint: string,
    config?: AxiosRequestConfig,
    publicCall?: boolean
  ): Promise<any>;
  post?(
    endpoint: string,
    data: any,
    config?: AxiosRequestConfig,
    isPublic?: boolean
  ): Promise<any>;
  patch?(
    endpoint: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<any>;
  delete?(endpoint: string): Promise<any>;
  getFile?(endpoint: string, config?: AxiosRequestConfig): Promise<any>;
  query?(
    document: DocumentNode,
    variables?: any,
    isPublic?: boolean
  ): Promise<any>;
  mutate?(
    document: DocumentNode,
    variables?: any,
    isPublic?: boolean
  ): Promise<any>;
  subscribe?(
    document: DocumentNode,
    variables?: any,
    isPublic?: boolean
  ): Observable<any>;
}
