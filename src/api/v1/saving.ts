import { Router, Request, Response } from 'express';
import { query } from '../../dal';

const savingRouter = Router();

savingRouter.get('/', async (req:Request, res:Response) => {
  const savings = await query({
    name: 'saving-get-all',
    text: 'SELECT * FROM saving',
  })
    .then(({ rows }) => rows);

  res.json(savings);
});

export default savingRouter;
