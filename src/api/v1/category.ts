import { Router, Request, Response } from 'express';
import { query } from '../../dal';

const categoryRouter = Router();

categoryRouter.get('/', (req:Request, res:Response) => {
  query('SELECT * FROM category')
    .then(results => {
      res.json(results.rows);
    });
});

export default categoryRouter;
