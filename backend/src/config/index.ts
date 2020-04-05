import dotenv from 'dotenv';

dotenv.config();

const {
  NODE_ENV,
  PORT,
  JWT_SECRET,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PW,
} = process.env;

export default {
  nodeEnv: NODE_ENV,
  port: PORT,
  jwtSecret: JWT_SECRET,
  database: {
    host: DB_HOST,
    port: DB_PORT,
    name: DB_NAME,
    user: DB_USER,
    pw: DB_PW,
  },
};
