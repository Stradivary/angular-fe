export interface HttpResponseEntity<T> {
  code: number;
  message: string;
  timestamp: number;
  data: T;
}
