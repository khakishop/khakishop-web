// ================================================================================
// 🎯 KHAKISHOP - API 타입 정의
// ================================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
  timestamp?: string;
}

export interface ImageApiResponse extends ApiResponse {
  data?: {
    mappedImages: number;
    protectedImages: number;
    stats?: any;
  };
}
