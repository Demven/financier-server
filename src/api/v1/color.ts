import { Router, Request, Response } from 'express';
import { query } from '../../dal';

const colorRouter = Router();

colorRouter.get('/', (req:Request, res:Response) => {
  query('SELECT * FROM color')
    .then(results => {
      res.json(results.rows);
    });
});

export default colorRouter;
