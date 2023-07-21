export interface IBaseResponse {
  meta: {
    code: string;
    message: string;
  };
  data: any;
}
