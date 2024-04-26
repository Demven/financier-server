import { Router, Request, Response } from 'express';
import { query } from '../../dal';

const investmentRouter = Router();

investmentRouter.get('/', (req:Request, res:Response) => {
  query('SELECT * FROM investment')
    .then(results => {
      res.json(results.rows);
    });
});

export default investmentRouter;
