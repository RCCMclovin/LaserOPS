import { User } from '../../generated/prisma/client';

export type CreateUserDTO = Pick<
  User,
  'name' | 'email' | 'password' | 'userTypeId'
>;

export type UpdateUserDTO = Pick<
  User,
  'name' | 'email' | 'userTypeId'
>;

export type SafeUpdateUserDTO = Pick<
  User,
  'name' | 'email' | 'password' 
>;

export type UserDTO = Omit<User, 'password'>;

export type SafeUserDTO = Omit<User, 'password' | 'userTypeId'>;
