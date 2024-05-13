import {
  Router,
  Request,
  Response,
} from 'express';
import {
  addExpense,
  updateExpense,
  deleteExpense,
  findAllByAccountIdForYear,
} from '../../services/expense';
import Expense, { validateExpense } from '../../types/Expense';

const expenseRouter = Router();

expenseRouter.get('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const year = Number(req.query.year)
    ? Number(req.query.year)
    : new Date().getFullYear();

  const expenses = await findAllByAccountIdForYear(accountId, year);

  res.json(expenses);
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
