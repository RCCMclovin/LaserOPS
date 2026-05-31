import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const doc = {
  info: {
    title: 'API dos notas',
    description: 'Documentação da API',
    version: '1.0',
  },
  host: process.env.HOST,
  definitions: {
    Auth: {
      msg: 'Usuário autenticado',
    },
    AuthDTO: {
      email: 'email@example.com',
      password: 'SenhaMuitoForte',
    },
    SignUpDto: {
      name: 'Fulano de Tal',
      email: 'email@example.com',
      password: 'SenhaMuitoForte',
    },
    LoginDTO: {
      id: '98ec6545-23d1-4d9e-a565-0c7452b45a8b',
      name: 'Fulano de Tal',
      email: 'email@example.com',
    },
    UserDTO: {
      id: "8cdebdfd-122c-4b03-af73-1009a621dfd4",
      email: "email@example.com",
      name: "Fulano de Tal",
      createdAt: "DateTime",
      updatedAt: "DateTime",
      userTypeId: "b7790a6f-48de-4ad0-b871-85f3649ef5b4"
    },
    EventPublic:{
        id: '98ec6545-23d1-4d9e-a565-0c7452b45a8b',
        date: "DateTime",
        creatorId: "8cdebdfd-122c-4b03-af73-1009a621dfd4",
        description: "Text",
        isPublished: "true",
        createdAt: "DateTime",
        updatedAt: "DateTime"
    },
    Event:{
        id: '98ec6545-23d1-4d9e-a565-0c7452b45a8b',
        date: "DateTime",
        creatorId: "8cdebdfd-122c-4b03-af73-1009a621dfd4",
        description: "Text",
        isPublished: "true",
        code: "ABCDEFGH",
        createdAt: "DateTime",
        updatedAt: "DateTime"
    },
    CreateEventDTO: {
        date: "DateTime",
        description: "Text"
    },
    CreateRequestDTO: {
        text: "Texto"
    },
    StoreRequest:{
        id: '98ec6545-23d1-4d9e-a565-0c7452b45a8b',
        createdAt: "DateTime",
        userId: "8cdebdfd-122c-4b03-af73-1009a621dfd4",
        status: "Aprovado",
        text: "Texto"
    },
    CreateUserDTO: {
        email: "email@example.com",
        name: "Fulano de Tal",
        password: "SenhaForte", 
        userTypeId: "7d1f6344-af5f-4cc3-bcc1-f0e3e35d4360"
    }

  },
};
const outputFile = './swagger-output.json';
const routes = [path.join(__dirname, 'router/index.ts')];
swaggerAutogen()(outputFile, routes, doc);