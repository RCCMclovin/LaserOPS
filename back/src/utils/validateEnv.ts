import { cleanEnv, port, str, url } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    CORS_ORIGIN: url(),
    PORT: port(),
    SESSION_SECRET: str(),
    HOST: str(),
    PUBLIC_PATH: str(),
    DATABASE_URL: str(),
  });
};

export default validateEnv;
