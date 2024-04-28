import { expressjwt } from 'express-jwt';
import { Request, Response } from 'express';

const { JWT_SECRET } = process.env;

// the decoded token payload will be available as req.auth object
export const authorization = expressjwt({
  secret: <string>JWT_SECRET,
  algorithms: ['HS256'],
});

export const processAuthError = (error:Error, req:Request, res:Response, next:Function) => {
  if (error.name === 'UnauthorizedError') {
    res.status(401).send('Unauthorized access');
  } else {
    next();
  }
};

export const authorizationChain = [
  authorization,
  processAuthError,
];
