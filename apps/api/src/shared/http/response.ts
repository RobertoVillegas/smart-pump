export interface ApiSuccessResponse<TData> {
  data: TData;
}

export const ok = <TData>(data: TData): ApiSuccessResponse<TData> => ({ data });
