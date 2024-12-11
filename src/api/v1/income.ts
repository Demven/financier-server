import {
  Router,
  Request,
  Response,
} from 'express';
import {
  findOneById,
  findAllByAccountIdForYear,
  addIncome,
  updateIncome,
  deleteIncome,
} from '../../services/income';
import { groupItemsByYearMonthWeek } from '../../services/items';
import Income, { validateIncome } from '../../types/Income';
import GroupedItems from '../../types/GroupedItems';

const incomeRouter = Router();

incomeRouter.get('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const year = Number(req.query.year)
    ? Number(req.query.year)
    : new Date().getFullYear();

  const incomes = await findAllByAccountIdForYear(accountId, year);
  const incomesGroupedByYearMonthWeek:GroupedItems = groupItemsByYearMonthWeek(incomes);

  res.json(incomesGroupedByYearMonthWeek);
});

incomeRouter.get('/:id', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;
  const { id: incomeId } = req.params;

  const income = await findOneById(accountId, Number(incomeId));

  res.json(income);
});

incomeRouter.put('/', async (req:Request, res:Response) => {
  const {
    name,
    dateString,
    year,
    month,
    week,
    amount,
  } = req.body;

  const { auth: { id: accountId }} = <any>req;

  const income:Income = {
    name,
    dateString,
    year,
    month,
    week,
    amount,
  } as Income;

  const { valid, error } = validateIncome(income);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const {
    success,
    income: savedIncome,
    totals,
  } = await addIncome(accountId, income);

  return res.json({
    success,
    income: savedIncome,
    totals,
  });
});

incomeRouter.post('/', async (req:Request, res:Response) => {
  const {
    id,
    name,
    dateString,
    year,
    month,
    week,
    amount,
  } = req.body;

  const { auth: { id: accountId }} = <any>req;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  const income:Income = {
    id,
    name,
    dateString,
    year,
    month,
    week,
    amount,
  } as Income;

  const { valid, error } = validateIncome(income);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const {
    success,
    totals,
  } = await updateIncome(accountId, income);

  return res.json({
    success,
    totals,
  });
});

incomeRouter.delete('/', async (req:Request, res:Response) => {
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
  } = await deleteIncome(accountId, id);

  return res.json({
    success,
    totals,
  });
});

export default incomeRouter;
