import { apiClient } from "@/lib/apiClient";
import {
  ApiResponse,
  ConfirmResetPasswordPayload,
  RequestResetCodePayload,
  ResendResetCodePayload,
  VerifyCodeResponse,
  VerifyResetCodePayload,
} from "@/types/auth";

export const authApi = {
  requestResetCode: async (
    payload: RequestResetCodePayload
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      "/api/accounts/password-reset/request/",
      payload
    );
    return response.data;
  },

  resendResetCode: async (
    payload: ResendResetCodePayload
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      "/api/accounts/password-reset/resend/",
      payload
    );
    return response.data;
  },

  verifyResetCode: async (
    payload: VerifyResetCodePayload
  ): Promise<VerifyCodeResponse> => {
    const response = await apiClient.post<VerifyCodeResponse>(
      "/api/accounts/password-reset/verify-code/",
      payload
    );
    return response.data;
  },

  confirmResetPassword: async (
    payload: ConfirmResetPasswordPayload
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      "/api/accounts/password-reset/confirm/",
      payload
    );
    return response.data;
  },
};
