import { Router, Request, Response } from 'express';
import { query } from '../../dal';

const expenseRouter = Router();

expenseRouter.get('/', async (req:Request, res:Response) => {
  const expenses = await query({
    name: 'expense-get-all',
    text: 'SELECT * FROM expense',
  })
    .then(({ rows }) => rows);

  res.json(expenses);
});

export default expenseRouter;
