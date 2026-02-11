/**
 * Institute API – GET /api/institute/detail/, POST /api/institute/
 * Uses api client which sends Bearer token via interceptors.
 */

import { api } from "@/lib/api";
import { CreateInstitutePayload, Institute } from "@/types/institute";

/** 404 or no-institute response; backend may return 404 or 200 with empty body when user has no institute. */
export const INSTITUTE_NOT_FOUND_STATUS = 404;

/** Error shape so isInstituteNotFoundError treats it as "no institute". */
const notFoundError = Object.assign(new Error("Institute not found"), {
  response: { status: INSTITUTE_NOT_FOUND_STATUS },
});

function isEmptyResponse(data: unknown): boolean {
  if (data == null) return true;
  if (typeof data !== "object") return true;
  const obj = data as Record<string, unknown>;
  // Empty object or missing required institute identifier
  if (
    typeof obj.id === "undefined" &&
    typeof obj.institute_name === "undefined"
  )
    return true;
  return false;
}

export function isInstituteNotFoundError(err: unknown): boolean {
  if (!err || typeof err !== "object" || !("response" in err)) return false;
  const res = (err as { response?: { status?: number } }).response;
  return res?.status === INSTITUTE_NOT_FOUND_STATUS;
}

/**
 * Get current user's institute. Requires auth (token sent by api interceptor).
 * Rejects when user has no institute (404 or 200 with empty/blank response).
 */
export async function getInstituteDetail(): Promise<Institute> {
  const { data } = await api.get<Institute>("/api/institutes/detail/");
  if (isEmptyResponse(data)) {
    throw notFoundError;
  }
  return data as Institute;
}

/**
 * Check if the current user has an institute (without throwing on 404).
 */
export async function hasInstitute(): Promise<boolean> {
  try {
    await getInstituteDetail();
    return true;
  } catch (err) {
    if (isInstituteNotFoundError(err)) return false;
    throw err;
  }
}

/** Institute list item for dropdowns */
export interface InstituteListItem {
  id: number;
  institute_name: string;
}

/**
 * List institutes (for dropdowns). GET /api/institutes/
 */
export async function getInstitutes(): Promise<InstituteListItem[]> {
  const { data } = await api.get<
    InstituteListItem[] | { results: InstituteListItem[] }
  >("/api/institutes/");
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "results" in data)
    return (data as { results: InstituteListItem[] }).results ?? [];
  return [];
}

/**
 * Create institute for the current user. Requires auth.
 */
export async function createInstitute(
  payload: CreateInstitutePayload,
): Promise<Institute> {
  const { data } = await api.post<Institute>("/api/institutes/", payload);
  return data;
}

const getApiBase = (): string => {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL)
    return process.env.NEXT_PUBLIC_API_URL;
  return "http://127.0.0.1:8000";
};

/**
 * Build the backend verification URL for institute email verify.
 * Path: api/institutes/verify/<uidb64>/<token>/
 */
export function getInstituteVerifyEmailUrl(
  uidb64: string,
  token: string,
): string {
  const base = getApiBase().replace(/\/$/, "");
  return `${base}/api/institutes/verify/${encodeURIComponent(uidb64)}/${encodeURIComponent(token)}/`;
}

/**
 * Call the backend to verify institute email. No auth required (link token is used).
 * GET /api/institutes/verify/<uidb64>/<token>/
 */
export async function verifyInstituteEmail(
  uidb64: string,
  token: string,
): Promise<{ success: boolean; message?: string }> {
  const url = getInstituteVerifyEmailUrl(uidb64, token);
  const res = await fetch(url, { method: "GET" });
  const contentType = res.headers.get("content-type") || "";
  const parseBody = async (): Promise<{ json?: any; text?: string }> => {
    if (contentType.includes("application/json")) {
      try {
        return { json: await res.json() };
      } catch {
        return { text: await res.text().catch(() => "") };
      }
    }
    return { text: await res.text().catch(() => "") };
  };

  const body = await parseBody();
  const msgFromJson =
    body.json && typeof body.json === "object"
      ? (body.json.message as string | undefined) ||
        (body.json.error as string | undefined)
      : undefined;
  const message = msgFromJson || body.text || undefined;

  if (!res.ok) {
    return {
      success: false,
      message: message || `Verification failed (${res.status})`,
    };
  }
  return { success: true, message };
}
