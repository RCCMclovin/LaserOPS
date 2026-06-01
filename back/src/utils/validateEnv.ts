import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    CORS_ORIGIN: str(),
    PORT: port(),
    SESSION_SECRET: str(),
    HOST: str(),
    PUBLIC_PATH: str(),
    DATABASE_URL: str(),
  });
};

export default validateEnv;
