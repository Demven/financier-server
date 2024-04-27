import { Router, Request, Response } from 'express';
import { query } from '../../dal';

const categoryRouter = Router();

categoryRouter.get('/', async (req:Request, res:Response) => {
  const categories = await query({
    name: 'category-get-all',
    text: 'SELECT * FROM category',
  })
    .then(({ rows }) => rows);

  res.json(categories);
});

export default categoryRouter;
