import { PrismaClient, User } from '../../generated/prisma/client';
import { CreateUserDTO, UserDTO } from './user.types';
import { genSalt, hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function getAllUsers(): Promise<UserDTO[]> {
  const users = await prisma.user.findMany();
  return users.map((u : User) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = u;
    return user;
  });
}

async function findUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { email } });
}

async function createUser(user: CreateUserDTO): Promise<User> {
  const salt = await genSalt();
  const password = await hash(user.password, salt);
  return prisma.user.create({ data: { ...user, password } });
}

async function updateUser(id: string, user: CreateUserDTO): Promise<User> {
  const salt = await genSalt();
  const password = await hash(user.password, salt);
  return prisma.user.update({
    where: { id },
    data: { ...user, password },
  });
}

async function removeUser(id: string): Promise<User> {
  return prisma.user.delete({
    where: { id },
  });
}

async function readUser(id: string): Promise<UserDTO> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...user } = (await prisma.user.findUnique({
    where: { id },
  })) as User;
  return user;
}

async function checkEmail(email: string): Promise<boolean> {
  return !!(await prisma.user.findUnique({ where: { email } }));
}

export default {
  getAllUsers,
  findUserByEmail,
  createUser,
  updateUser,
  removeUser,
  readUser,
  checkEmail,
};