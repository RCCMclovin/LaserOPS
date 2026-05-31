import expressSession from 'express-session';
import { v4 as uuidV4 } from 'uuid';

function session() {
  return expressSession({
  genid: () => uuidV4(),
  secret: process.env.SESSION_SECRET!, 
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60,
    sameSite: "lax",
    },
  });
}

export default session;