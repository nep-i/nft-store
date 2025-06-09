import { BaseModel } from "../models/base.model";
import { BaseApolloRepository } from "../repositories/baseApollo.repository";
import { BaseApiRepository } from "../repositories/baseApi.repository";
import { DocumentNode } from "@apollo/client";

export type RepoParams = {
  id?: string;
  filters?: FilterObject;
  model?: BaseModel;
  page?: number;
  isMaxPage?: boolean;
  pageSize?: number;
  tenant?: string;
  lang?: string;
  base: typeof BaseApolloRepository | typeof BaseApiRepository;
  query?: DocumentNode;
  isPublic?: boolean;
  variables?: {};
};

export type FilterType = "array" | "stringObject" | "model" | "string";

export interface IFilter<T> {
  type: FilterType;
  value?: T;
  key: string;
}

export type FilterObject = Record<string, IFilter<any>>;
