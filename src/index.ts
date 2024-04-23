import express, { Request, Response } from 'express';
const dotenv = require('dotenv');
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';

dotenv.config();

const {
  PORT = '3000',
} = process.env;

const app = express();

app.get('/', (request:Request, response:Response) => {
  response.send('Status: running');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
