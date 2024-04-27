import { Router, Request, Response } from 'express';
import { query } from '../../dal';

const colorRouter = Router();

colorRouter.get('/', async (req:Request, res:Response) => {
  const colors = await query({
    name: 'color-get-all',
    text: 'SELECT * FROM color',
  })
    .then(({ rows }) => rows);

  res.json(colors);
});

export default colorRouter;
