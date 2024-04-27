import { Router, Request, Response } from 'express';
import { query } from '../../dal';

const incomeRouter = Router();

incomeRouter.get('/', async (req:Request, res:Response) => {
  const incomes = await query({
    name: 'income-get-all',
    text: 'SELECT * FROM income',
  })
    .then(({ rows }) => rows);

  res.json(incomes);
});

export default incomeRouter;
