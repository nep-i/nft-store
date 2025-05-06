import { BaseApiRepository } from "../Repositories/baseApi.repository";
import { Store } from "redux";

export type apiUrlType = {
  baseUrl: string;
  apiSuffix: string;
};

export type featuresType = {
  demographic: boolean;
  feedback: boolean;
};
export class RepositoryFactory {
  private static repositoryInstances: any = {};
  static requestTokenInterceptorCallback?: any;
  static responseErrorInterceptorCallback?: any;
  static store: Store<any>;

  private static apiUrl: apiUrlType = {
    baseUrl: "",
    apiSuffix: "",
  };

  public static get<T extends BaseApiRepository>(
    RepositoryClass: new (...params: any[]) => T
  ): T {
    const repositoryId = new RepositoryClass().id;

    let repository = this.repositoryInstances[repositoryId];
    if (!repository) {
      repository = new RepositoryClass();

      this.repositoryInstances[repositoryId] = repository;
    }

    return repository;
  }

  public static setInterceptors(
    request: any,
    response: any,
    store?: Store<any>
  ) {
    this.requestTokenInterceptorCallback = request;
    this.responseErrorInterceptorCallback = response;
    if (store) this.store = store;
  }

  public static setUrl(url: apiUrlType) {
    this.apiUrl = url;
  }

  public static getUrl(): apiUrlType {
    return this.apiUrl;
  }
}
