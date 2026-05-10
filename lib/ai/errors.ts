import "server-only";

export type ChatErrorCode =
  | "rate_limited"
  | "provider_unavailable"
  | "bad_request"
  | "server_error"
  | "generic";

export type MappedError = {
  status: number;
  code: ChatErrorCode;
};

export function mapError(error: unknown): MappedError {
  // The "generic" code is reserved for the client when it cannot decode the
  // error body. The server always returns a specific code from the four
  // operational codes below.
  if (error && typeof error === "object" && "statusCode" in error) {
    const statusCode = Number((error as { statusCode: unknown }).statusCode);
    if (statusCode === 429) return { status: 429, code: "rate_limited" };
    if (statusCode >= 500) return { status: 502, code: "provider_unavailable" };
    if (statusCode === 400) return { status: 400, code: "bad_request" };
    if (statusCode === 401 || statusCode === 403) {
      return { status: 502, code: "provider_unavailable" };
    }
  }

  return { status: 500, code: "server_error" };
}
