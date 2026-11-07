export interface IApi {
  isSuccessStatusCode: boolean;
  statusCode: number;
  message?: string;
  totalRecords?: number;
  resultId?: string;
  modelState?: unknown;
  isFromCache: boolean;
}
