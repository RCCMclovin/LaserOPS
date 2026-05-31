import { PrismaClient } from '../src/generated/prisma/client';
import { UserTypes } from '../src/resources/userType/userType.consts';
import { genSalt, hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.userType.createMany({
    data: [
      { id: UserTypes.admin,  label: 'admin' },
      { id: UserTypes.store,  label: 'store' },
      { id: UserTypes.client, label: 'client'},
    ],
    skipDuplicates: true,
  });
  const salt = await genSalt();
  const password = await hash('admin', salt);
  await prisma.user.create({
    data: {
      id: '98ec6545-23d1-4d9e-a565-0c7452b45a8b',
      email: 'admin@example.com',
      name: 'Admin',
      password: password,
      userTypeId: UserTypes.admin,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
  });