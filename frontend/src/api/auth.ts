const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface SignupResponse {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface ApiFieldError {
  field: string;
  message: string;
  rejectedValue: string | null;
}

export class ApiError extends Error {
  status: number;
  fieldErrors: ApiFieldError[];

  constructor(message: string, status: number, fieldErrors: ApiFieldError[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface ErrorResponse {
  status?: number;
  message?: string;
  error?: string;
  timestamp?: string;
  path?: string;
  fieldErrors?: ApiFieldError[];
}

export async function signup(request: SignupRequest): Promise<SignupResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let errorData: ErrorResponse | null = null;
    try {
      errorData = (await response.json()) as ErrorResponse;
    } catch {
      // Ignore parsing errors and use a default message.
    }

    throw new ApiError(
      errorData?.message ?? `Signup failed: ${response.status}`,
      response.status,
      errorData?.fieldErrors ?? [],
    );
  }

  return (await response.json()) as SignupResponse;
}