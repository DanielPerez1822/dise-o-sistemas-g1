export class ApiResponseDto<T> {
    status_apiresponse: boolean;
    data: T;
    message: string;
  }