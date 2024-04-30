require('dotenv').config();

import express, {
  Express,
  Request,
  Response,
  NextFunction,
} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { connectToDatabase } from './dal';
import apiV1Router from './api/v1';

const {
  NODE_ENV,
  PORT = '3000',
} = process.env;

connectToDatabase();

const app:Express = express();

if (NODE_ENV === 'development') {
  app.use(cors());
} else {
  app.use(cors({ origin: /\.thefinancier\.app$/ }));
}

if (NODE_ENV === 'production') {
  app.use((req:Request, res:Response, next:NextFunction) => {
    if (req.secure) {
      next();
    } else {
      res.redirect('https://' + req.headers.host + req.url);
    }
  });
}

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
