import { Router, Request, Response } from 'express';
import { query } from '../../dal';

const incomeRouter = Router();

incomeRouter.get('/', (req:Request, res:Response) => {
  query('SELECT * FROM income')
    .then(results => {
      res.json(results.rows);
    });
});

export default incomeRouter;
