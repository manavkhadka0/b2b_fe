import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import { authApi } from "@/api/auth";
import {
  ApiErrorResponse,
  ApiResponse,
  ConfirmResetPasswordPayload,
  RequestResetCodePayload,
  ResendResetCodePayload,
  VerifyCodeResponse,
  VerifyResetCodePayload,
} from "@/types/auth";

interface MutationOptions<TData, TPayload> {
  onSuccess?: (data: TData) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}

interface MutationResult<TData, TPayload> {
  mutate: (payload: TPayload, options?: MutationOptions<TData, TPayload>) => Promise<TData | undefined>;
  isPending: boolean;
  error: AxiosError<ApiErrorResponse> | null;
  data: TData | null;
}

function useSimpleMutation<TData, TPayload>(
  mutationFn: (payload: TPayload) => Promise<TData>
): MutationResult<TData, TPayload> {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<AxiosError<ApiErrorResponse> | null>(null);
  const [data, setData] = useState<TData | null>(null);

  const mutate = useCallback(
    async (payload: TPayload, options?: MutationOptions<TData, TPayload>) => {
      setIsPending(true);
      setError(null);
      try {
        const result = await mutationFn(payload);
        setData(result);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const axiosErr = err as AxiosError<ApiErrorResponse>;
        setError(axiosErr);
        options?.onError?.(axiosErr);
      } finally {
        setIsPending(false);
      }
    },
    [mutationFn]
  );

  return { mutate, isPending, error, data };
}

export const useRequestResetCode = () => {
  return useSimpleMutation<ApiResponse, RequestResetCodePayload>((payload) =>
    authApi.requestResetCode(payload)
  );
};

export const useResendResetCode = () => {
  return useSimpleMutation<ApiResponse, ResendResetCodePayload>((payload) =>
    authApi.resendResetCode(payload)
  );
};

export const useVerifyResetCode = () => {
  return useSimpleMutation<VerifyCodeResponse, VerifyResetCodePayload>((payload) =>
    authApi.verifyResetCode(payload)
  );
};

export const useConfirmResetPassword = () => {
  return useSimpleMutation<ApiResponse, ConfirmResetPasswordPayload>((payload) =>
    authApi.confirmResetPassword(payload)
  );
};
