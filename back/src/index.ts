import express from 'express';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from './middlewares/session';
import router from './router/index';
import validateEnv from './utils/validateEnv';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';

dotenv.config();
validateEnv();


const limiter = rateLimit({
 windowMs: 15 * 60 * 1000,
 max: 100,
 message: {
   error: 'Excesso de requisições, tente novamente mais tarde.',
   retryAfter: '15 minutes',
 },
 standardHeaders: true,
 legacyHeaders: false, 
});

const app = express();
const PORT = process.env.PORT || 3333;

app.use(
  cors({
    origin: '*', //Para resolver um erro de proxy
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  }),
);

app.use(helmet());
app.use(limiter);

app.use(cookieParser());

app.use(session());

app.use(express.json());
app.use(bodyParser.raw({ type: 'image/*', limit: '10mb' }));
/*
// Uncomment to log all requests
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
//*/
app.use(router);

app.listen(PORT, () => {
  console.log(`Express app iniciado na porta ${PORT}.`);
});