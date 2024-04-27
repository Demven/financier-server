import { Router, Request, Response } from 'express';
import { query } from '../../dal';

const investmentRouter = Router();

investmentRouter.get('/', async (req:Request, res:Response) => {
  const investments = await query({
    name: 'investment-get-all',
    text: 'SELECT * FROM investment',
  })
    .then(({ rows }) => rows);

  res.json(investments);
});

export default investmentRouter;
