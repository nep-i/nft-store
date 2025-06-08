import { AxiosRequestConfig } from "axios";
import { IBaseRepository } from "../Interfaces/baseRepository.interface";
import { RepoParams, FilterObject } from "../Interfaces/repoParams.interface";
import { BaseModel } from "../Models/base.model";
import { BaseSwitcher } from "./base.switcher";
import { DocumentNode } from "@apollo/client";
import { Observable } from "@apollo/client/utilities";

export abstract class BaseRepository<T>
  extends BaseSwitcher.dynamicBase
  implements IBaseRepository<T>
{
  public get?: (
    endpoint: string,
    config?: AxiosRequestConfig,
    publicCall?: boolean
  ) => Promise<any>;
  public post?: (
    endpoint: string,
    data: any,
    config?: AxiosRequestConfig,
    isPublic?: boolean
  ) => Promise<any>;
  public patch?: (
    endpoint: string,
    data: any,
    config?: AxiosRequestConfig
  ) => Promise<any>;
  public delete?: (endpoint: string) => Promise<any>;
  public getFile?: (
    endpoint: string,
    config?: AxiosRequestConfig
  ) => Promise<any>;
  public query?: (
    document: DocumentNode,
    variables?: any,
    isPublic?: boolean
  ) => Promise<any>;
  public mutate?: (
    document: DocumentNode,
    variables?: any,
    isPublic?: boolean
  ) => Promise<any>;
  public subscribe?: (
    document: DocumentNode,
    variables?: any,
    isPublic?: boolean
  ) => Observable<any>;

  abstract id: string;
  abstract endpoint: string;
  abstract model: any;

  publicCall: boolean = false;

  defaultPageSize: number = 30;

  private processUrlParams(params: RepoParams): URLSearchParams {
    let urlParams: URLSearchParams = new URLSearchParams();

    if (params.filters) {
      urlParams = this.processFilters(params.filters, urlParams);
    }

    if (params.page) {
      urlParams.append("page", params.page.toString());
    }

    if (params.tenant) {
      urlParams.append("tenant", params.tenant);
    }

    urlParams.append("page_size", this.getPageSize(params));

    return urlParams;
  }

  private getPageSize(params: RepoParams): string {
    return params.pageSize?.toString() || this.defaultPageSize.toString();
  }

  private processTenantParam(params: RepoParams): URLSearchParams {
    const urlParams = new URLSearchParams();
    if (params.tenant) {
      urlParams.append("tenant", params.tenant);
    }
    return urlParams;
  }

  private processFilters(
    filters: FilterObject,
    urlParams: URLSearchParams
  ): URLSearchParams {
    Object.entries(filters).forEach(([key, filter]) => {
      if (!filter.value) return;

      switch (filter.type) {
        case "array":
          (filter.value as BaseModel[]).forEach((model) => {
            model.id && urlParams.append(`${filter.key}[]`, model.id);
          });
          break;

        case "stringObject":
          Object.entries(filter.value as Record<string, string>).forEach(
            ([objKey, objValue]) => {
              urlParams.append(objKey, objValue);
            }
          );
          break;

        case "model":
          const entity = filter.value as BaseModel;
          entity.id && urlParams.append(filter.key, entity.id);
          break;

        case "string":
          urlParams.append(filter.key, filter.value as string);
          break;
      }
    });

    return urlParams;
  }

  async getArray(
    repoParams: RepoParams
  ): Promise<{ count: number; result: T[]; repoParams: RepoParams }> {
    const urlParams = this.processUrlParams(repoParams);

    const apolloFunc = async () => {
      const query = this.getArrayQuery();
      const response = this.query
        ? await this.query(query, repoParams, this.publicCall)
        : () => {};
      const result: T[] = (response[this.id]?.results || []).map((item: any) =>
        this.model.deserialize(item)
      );
      const count = response[this.id]?.count || result.length;
      repoParams.isMaxPage = !response[this.id]?.next;
      return { count, result, repoParams };
    };

    return this.get
      ? await this.get(
          this.endpoint,
          { params: urlParams },
          this.publicCall
        ).then((response: any) => {
          const result: T[] = [];
          const count = response.count ?? response;
          const results = response.results ?? response;
          for (const content of results) {
            result.push(this.model.deserialize(content));
          }
          repoParams.isMaxPage = response.next === null;
          return { count, result, repoParams };
        })
      : apolloFunc();
  }

  async getSingle(
    repoParams: RepoParams
  ): Promise<{ result: T; params: RepoParams }> {
    if (!BaseSwitcher.isApolloRepository) {
      if (!this.get) {
        throw new Error("get method is not available in API mode");
      }
      let localId = repoParams.id;
      if (localId && !localId.endsWith("/")) {
        localId += "/";
      }
      const urlParams = this.processTenantParam(repoParams);
      const response = await this.get(
        `${this.endpoint}${localId}`,
        { params: urlParams },
        this.publicCall
      );
      return { result: this.model.deserialize(response), params: repoParams };
    } else {
      if (!this.query) {
        throw new Error("query method is not available in Apollo mode");
      }
      const query = this.getQuery();
      const response = await this.query(
        query,
        { id: repoParams.id, tenant: repoParams.tenant },
        this.publicCall
      );
      const result = response[this.id]
        ? this.model.deserialize(response[this.id])
        : null;
      if (!result) {
        throw new Error(`No ${this.id} found with id ${repoParams.id}`);
      }
      return { result, params: repoParams };
    }
  }

  async create(params: RepoParams): Promise<{ result: T; params: RepoParams }> {
    const urlParams = this.processTenantParam(params);
    if (!this.post) {
      throw new Error("get method is not available in API mode");
    }
    return await this.post(this.endpoint, params.model?.serialize(), {
      params: urlParams,
    }).then((response: any) => {
      return { result: this.model.deserialize(response), params };
    });
  }

  async update(params: RepoParams): Promise<{ result: T; params: RepoParams }> {
    const urlParams = this.processTenantParam(params);
    if (!this.patch) throw new Error("patch method is not available");
    return await this.patch(
      `${this.endpoint}${params.id}/`,
      params.model?.serialize(),
      { params: urlParams }
    ).then((response: any) => {
      return { result: this.model.deserialize(response), params };
    });
  }

  subscribeToMessages(roomId: string): Observable<{ messageAdded: T }> {
    if (!this.subscribe) throw new Error("subscribe method is not available");
    const subscription = this.getMessageSubscription();
    return this.subscribe(subscription, { roomId }, this.publicCall);
  }

  protected abstract getArrayQuery(): DocumentNode;
  protected abstract getSingleQuery(): DocumentNode;
  protected abstract getCreateMutation(): DocumentNode;
  protected abstract getMessageSubscription(): DocumentNode;
}
