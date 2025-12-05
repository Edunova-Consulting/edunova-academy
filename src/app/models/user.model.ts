export enum UserRole {
  Admin = 'Admin',
  Teacher = 'Teacher',
  Student = 'Student'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

