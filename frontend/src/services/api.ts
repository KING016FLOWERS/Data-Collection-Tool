import type { User, UserPayload, UserStatus } from "../types";

type ApiErrorBody = { message?: string };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...init,
      credentials: "same-origin",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new Error("Cannot reach the API server. Start the backend on port 5000.");
  }

  const raw = await response.text();
  let body: unknown = null;
  if (raw) {
    try { body = JSON.parse(raw); } catch { body = raw; }
  }

  if (!response.ok) {
    const message = typeof body === "object" && body !== null && "message" in body
      ? String((body as ApiErrorBody).message ?? "Request failed")
      : `Request failed (${response.status})`;
    if (response.status === 401 && !path.startsWith("/auth/")) {
      window.dispatchEvent(new Event("dct:auth-expired"));
    }
    throw new Error(message);
  }

  return body as T;
}

export type UserIdCheck = { available: boolean; message: string };
export const usersApi = {
  checkUserId: (userId: string) => request<UserIdCheck>(`/users/check-user-id?userId=${encodeURIComponent(userId)}`),
  list: () => request<User[]>("/users"),
  create: (payload: UserPayload & { userId: string; password: string }) =>
    request<{ message: string }>("/users", { method: "POST", body: JSON.stringify(payload) }),
  update: (userId: string, payload: UserPayload) =>
    request<{ message: string }>(`/users/${encodeURIComponent(userId)}`, { method: "PUT", body: JSON.stringify(payload) }),
  setStatus: (userId: string, status: UserStatus) =>
    request<{ message: string }>(`/users/${encodeURIComponent(userId)}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  remove: (userId: string) =>
    request<{ message: string }>(`/users/${encodeURIComponent(userId)}`, { method: "DELETE" }),
};

export function apiErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export type LoginSession = {
  userId: string;
  name: string | null;
  role: "main_admin" | "top_management" | "department";
  industry: string | null;
  department: string | null;
  moduleId: string | null;
  expiresAt: string;
};

export const authApi = {
  login: (userID: string, password: string) =>
    request<LoginSession>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ userID, password }),
    }),
  me: () => request<LoginSession>("/auth/me"),
  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),
};

export type TopManagementRegistration = {
  userId: string;
  industry: string;
  email: string | null;
  address: string;
  role: string;
  status: "Pending" | "Approved" | "Rejected";
  departmentUserCount: number;
};

export const registrationApi = {
  checkUserId: (userId: string) => request<UserIdCheck>(`/register/check-user-id?userId=${encodeURIComponent(userId)}`),
  checkEmail: (email: string) => request<UserIdCheck>(`/register/check-email?email=${encodeURIComponent(email)}`),
  register: (payload: { userId: string; password: string; industry: string; email: string; address: string }) =>
    request<{ message: string }>("/register", { method: "POST", body: JSON.stringify(payload) }),
};

export const adminApi = {
  registrations: () => request<TopManagementRegistration[]>("/admin/registrations"),
  remove: (userId: string, confirmIndustry: string) =>
    request<{ message: string; deletedDepartmentUsers: number }>(`/admin/registrations/${encodeURIComponent(userId)}`, {
      method: "DELETE", body: JSON.stringify({ confirmUserId: userId, confirmIndustry }),
    }),
  setStatus: (userId: string, status: "Approved" | "Rejected") =>
    request<{ message: string }>(`/admin/registrations/${encodeURIComponent(userId)}/status`, {
      method: "PATCH", body: JSON.stringify({ status }),
    }),
};

export type ManagementProfile = {
  userId: string;
  industry: string;
  address: string;
  email: string;
  role: string;
  status: string;
};
export const profileApi = {
  get: () => request<ManagementProfile>("/top-management/profile"),
  checkEmail: (email: string) => request<UserIdCheck>(`/top-management/profile/check-email?email=${encodeURIComponent(email)}`),
  update: (payload: { industry: string; address: string; email: string; currentPassword: string; newPassword?: string }) =>
    request<{ message: string; profile: ManagementProfile; departmentSessionsRequireLogin: boolean }>("/top-management/profile", {
      method: "PUT", body: JSON.stringify(payload),
    }),
};
