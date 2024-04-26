import { Router, Request, Response } from 'express';
import { query } from '../../dal';

const expenseRouter = Router();

expenseRouter.get('/', (req:Request, res:Response) => {
  query('SELECT * FROM expense')
    .then(results => {
      res.json(results.rows);
    });
});

export default expenseRouter;
