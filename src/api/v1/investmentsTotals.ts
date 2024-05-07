import {
  Router,
  Request,
  Response,
} from 'express';
import {
  calculateInvestmentsTotalsForAccount,
  getInvestmentsTotals,
  saveInvestmentsTotals,
} from '../../services/investmentsTotals';
import Totals from '../../types/Totals';

const investmentsTotalsRouter = Router();

investmentsTotalsRouter.get('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const totals:Totals = await getInvestmentsTotals(accountId);

  res.json(totals);
});

investmentsTotalsRouter.post('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const totals:Totals = await calculateInvestmentsTotalsForAccount(accountId);

  const success = await saveInvestmentsTotals(accountId, totals);

  res.json({ success });
});

export default investmentsTotalsRouter;
