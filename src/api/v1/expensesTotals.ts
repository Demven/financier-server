import {
  Router,
  Request,
  Response,
} from 'express';
import {
  getExpensesTotals,
  calculateExpensesTotalsForAccount,
  saveExpensesTotals,
} from '../../services/expensesTotals';
import Totals from '../../types/Totals';

const expensesTotalsRouter = Router();

expensesTotalsRouter.get('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const totals:Totals = await getExpensesTotals(accountId);

  res.json(totals);
});

expensesTotalsRouter.post('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const totals:Totals = await calculateExpensesTotalsForAccount(accountId);

  const success = await saveExpensesTotals(accountId, totals);

  res.json({ success });
});

export default expensesTotalsRouter;
