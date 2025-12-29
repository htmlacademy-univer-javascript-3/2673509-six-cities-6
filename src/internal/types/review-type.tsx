import {UserType} from './user.tsx';

export type ReviewType = {
  id: string;
  date: string;
  user: UserType;
  comment: string;
  rating: number;
};
