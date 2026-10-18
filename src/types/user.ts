export type UserDetail = {
  id?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  status: string | number;
  isCreating: boolean;
  isValid: boolean;
  fullName: string;
  skills: string[];
  role: string;
  isSaving?: boolean;
  isFetching: boolean;
  message: string;
  error: string;
};

export type SingleUser = {
  id: string;
  email: string;
};
