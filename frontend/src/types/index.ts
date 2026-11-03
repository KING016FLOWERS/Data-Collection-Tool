export type SustainabilityModule = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
};

export type UserStatus = "Active" | "Suspended";

export type User = {
  userId: string;
  name: string;
  department: string;
  industry: string;
  email: string;
  status: UserStatus;
  createdAt: string;
};

export type UserPayload = {
  userId?: string;
  password?: string;
  name: string;
  department: string;
  email: string;
};
