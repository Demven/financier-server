require('dotenv').config();

import express, {
  Express,
  Request,
  Response,
  NextFunction,
} from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { connectToDatabase } from './dal';
import apiV1Router from './api/v1';

const {
  PORT = '3000',
} = process.env;

connectToDatabase();

const app:Express = express();

app.get('/', (request:Request, response:Response) => {
  response.send('Status: running');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

app.use('/v1', apiV1Router);

// Optional fallthrough error handler
app.use((error:Error, req:Request, res:Response, next:NextFunction) => {
  if (error.message) {
    console.error('Caught error: ', error.message);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
