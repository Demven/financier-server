import {
  Router,
  Request,
  Response,
} from 'express';
import {
  getIncomesTotals,
  calculateIncomesTotalsForAccount,
  saveIncomesTotals,
} from '../../services/incomesTotals';
import Totals from '../../types/Totals';

const incomesTotalsRouter = Router();

incomesTotalsRouter.get('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const totals:Totals = await getIncomesTotals(accountId);

  res.json(totals);
});

incomesTotalsRouter.post('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const totals:Totals = await calculateIncomesTotalsForAccount(accountId);

  const success = await saveIncomesTotals(accountId, totals);

  res.json({ success });
});

export default incomesTotalsRouter;
