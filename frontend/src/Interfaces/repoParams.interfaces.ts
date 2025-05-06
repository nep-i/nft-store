import { BaseModel } from "../Models/base.model";

export type RepoParams = {
  id?: string;
  filters?: FilterObject;
  model?: BaseModel;
  page?: number;
  isMaxPage?: boolean;
  pageSize?: number;
  tenant?: string;
  lang?: string;
};

export type FilterType = "array" | "stringObject" | "model" | "string";

export interface IFilter<T> {
  type: FilterType;
  value?: T;
  key: string;
}

export type FilterObject = Record<string, IFilter<any>>;
