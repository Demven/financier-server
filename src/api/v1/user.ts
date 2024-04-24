import { Router, Request, Response } from 'express';
import getConnection from '../../dal';

const userRouter = Router();

userRouter.get('/', (req:Request, res:Response) => {
  const connection = getConnection();

  return connection.query('SELECT * FROM user')
    .then(results => {
      res.json(results.rows);
    });
});

export default userRouter;
