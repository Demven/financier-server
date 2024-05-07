import {
  Router,
  Request,
  Response,
} from 'express';
import {
  calculateSavingsTotalsForAccount,
  getSavingsTotals,
  saveSavingsTotals,
} from '../../services/savingsTotals';
import Totals from '../../types/Totals';

const savingsTotalsRouter = Router();

savingsTotalsRouter.get('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const totals:Totals = await getSavingsTotals(accountId);

  res.json(totals);
});

savingsTotalsRouter.post('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const totals:Totals = await calculateSavingsTotalsForAccount(accountId);

  const success = await saveSavingsTotals(accountId, totals);

  res.json({ success });
});


export default savingsTotalsRouter;
