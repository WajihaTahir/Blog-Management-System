export interface UserType {
  _id: string;
  email: string;
  password: string;
  username: string;
  role: "user" | "admin";
}

export interface UpdateUserFieldType {
  email?: string;
  password?: string;
  username?: string;
}
