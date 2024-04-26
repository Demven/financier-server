import { Router, Request, Response } from 'express';
import { query } from '../../dal';

const savingRouter = Router();

savingRouter.get('/', (req:Request, res:Response) => {
  query('SELECT * FROM saving')
    .then(results => {
      res.json(results.rows);
    });
});

export default savingRouter;
