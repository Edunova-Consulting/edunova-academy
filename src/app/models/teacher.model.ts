import { User } from './user.model';

export interface Teacher extends User {
  first_name?: string;
  last_name?: string;
  phone?: string;
}

