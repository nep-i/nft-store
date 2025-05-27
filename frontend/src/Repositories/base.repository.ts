import { BaseApiRepository } from "./baseApi.repository";
import { RepoParams, FilterObject } from "../Interfaces/repoParams.interfaces";
import { BaseModel } from "../Models/base.model";

export abstract class BaseRepository<T> extends BaseApiRepository {
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
      if (!filter.value) return; // Skip if no value

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

    return await this.get(
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
    });
  }

  async getSingle(
    params: RepoParams
  ): Promise<{ result: T; params: RepoParams }> {
    let localId = params.id;
    if (localId && !localId.endsWith("/")) {
      localId += "/";
    }
    const urlParams = this.processTenantParam(params);
    return await this.get(
      `${this.endpoint}${localId}`,
      { params: urlParams },
      this.publicCall
    ).then((response: any) => {
      return { result: this.model.deserialize(response), params };
    });
  }

  async create(params: RepoParams): Promise<{ result: T; params: RepoParams }> {
    const urlParams = this.processTenantParam(params);
    return await this.post(this.endpoint, params.model?.serialize(), {
      params: urlParams,
    }).then((response: any) => {
      return { result: this.model.deserialize(response), params };
    });
  }

  async update(params: RepoParams): Promise<{ result: T; params: RepoParams }> {
    const urlParams = this.processTenantParam(params);
    return await this.patch(
      `${this.endpoint}${params.id}/`,
      params.model?.serialize(),
      { params: urlParams }
    ).then((response: any) => {
      return { result: this.model.deserialize(response), params };
    });
  }
}
