import { User } from '../../generated/prisma/client';

export type CreateUserDTO = Pick<
  User,
  'name' | 'email' | 'password' | 'userTypeId'
>;

export type UpdateUserDTO = Pick<
  User,
  'name' | 'email' | 'userTypeId'
>;

export type UserDTO = Omit<User, 'password'>;
