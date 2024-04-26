import { Router, Request, Response } from 'express';
import { query } from '../../dal';

const accountRouter = Router();

accountRouter.get('/', (req:Request, res:Response) => {
  query('SELECT * FROM account')
    .then(results => {
      res.json(results.rows);
    });
});

export default accountRouter;
