import {
  Router,
  Request,
  Response,
} from 'express';
import {
  findAllByAccountIdForYear,
  addInvestment,
  updateInvestment,
  deleteInvestment,
} from '../../services/investment';
import Investment, { validateInvestment } from '../../types/Investment';

const investmentRouter = Router();

investmentRouter.get('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const year = Number(req.query.year)
    ? Number(req.query.year)
    : new Date().getFullYear();

  const investments = await findAllByAccountIdForYear(accountId, year);

  res.json(investments);
});

investmentRouter.put('/', async (req:Request, res:Response) => {
  const {
    name,
    dateString,
    year,
    month,
    week,
    ticker,
    shares,
    pricePerShare,
  } = req.body;

  const { auth: { id: accountId }} = <any>req;

  const investment:Investment = {
    name,
    dateString,
    year,
    month,
    week,
    ticker,
    shares,
    pricePerShare,
  } as Investment;

  const { valid, error } = validateInvestment(investment);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const {
    success,
    investment: savedInvestment,
    totals,
  } = await addInvestment(accountId, investment);

  return res.json({
    success,
    investment: savedInvestment,
    totals,
  });
});

investmentRouter.post('/', async (req:Request, res:Response) => {
  const {
    id,
    name,
    dateString,
    year,
    month,
    week,
    ticker,
    shares,
    pricePerShare,
  } = req.body;

  const { auth: { id: accountId }} = <any>req;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  const investment:Investment = {
    id,
    name,
    dateString,
    year,
    month,
    week,
    ticker,
    shares,
    pricePerShare,
  } as Investment;

  const { valid, error } = validateInvestment(investment);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const {
    success,
    totals,
  } = await updateInvestment(accountId, investment);

  return res.json({
    success,
    totals,
  });
});

investmentRouter.delete('/', async (req:Request, res:Response) => {
  const { id } = req.body;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  const { auth: { id: accountId }} = <any>req;

  const {
    success,
    totals,
  } = await deleteInvestment(accountId, id);

  return res.json({
    success,
    totals,
  });
});

export default investmentRouter;
