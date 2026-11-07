import { type IApi } from "./api";

export interface IApiData<T> extends IApi {
  data?: {
    length: number;
    dados: T;
    content: [];
  };
  message: string;
}
