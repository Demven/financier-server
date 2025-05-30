import {
  Router,
  Request,
  Response,
} from 'express';
import {
  findOneById,
  addExpense,
  updateExpense,
  deleteExpense,
  findAllByAccountIdForYear,
} from '../../services/expense';
import { groupItemsByYearMonthWeek } from '../../services/items';
import Expense, { validateExpense } from '../../types/Expense';
import GroupedItems from '../../types/GroupedItems';

const expenseRouter = Router();

expenseRouter.get('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const year = Number(req.query.year)
    ? Number(req.query.year)
    : new Date().getFullYear();

  const expenses = await findAllByAccountIdForYear(accountId, year);
  const expensesGroupedByYearMonthWeek:GroupedItems = groupItemsByYearMonthWeek(expenses);

  res.json(expensesGroupedByYearMonthWeek);
});

expenseRouter.get('/:id', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;
  const { id: expenseId } = req.params;

  const expense = await findOneById(accountId, Number(expenseId));

  res.json(expense);
});

expenseRouter.put('/', async (req:Request, res:Response) => {
  const {
    name,
    categoryId,
    dateString,
    year,
    month,
    week,
    amount,
  } = req.body;

  const { auth: { id: accountId }} = <any>req;

  const expense:Expense = {
    name,
    categoryId,
    dateString,
    year,
    month,
    week,
    amount,
  } as Expense;

  const { valid, error } = validateExpense(expense);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const {
    success,
    expense: savedExpense,
    totals,
  } = await addExpense(accountId, expense);

  return res.json({
    success,
    expense: savedExpense,
    totals,
  });
});

expenseRouter.post('/', async (req:Request, res:Response) => {
  const {
    id,
    name,
    categoryId,
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

  const expense:Expense = {
    id,
    name,
    categoryId,
    dateString,
    year,
    month,
    week,
    amount,
  } as Expense;

  const { valid, error } = validateExpense(expense);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const {
    success,
    totals,
  } = await updateExpense(accountId, expense);

  return res.json({
    success,
    totals,
  });
});

expenseRouter.delete('/', async (req:Request, res:Response) => {
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
  } = await deleteExpense(accountId, id);

  return res.json({
    success,
    totals,
  });
});

export default expenseRouter;
