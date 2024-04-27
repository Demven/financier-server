import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import { query } from '../../dal';
import Expense, { validateExpense } from '../../types/Expense';

const expenseRouter = Router();

expenseRouter.get('/', async (req:Request, res:Response) => {
  const expenses = await query({
    name: 'expense-get-all',
    text: 'SELECT * FROM expense',
  })
    .then(({ rows }) => rows);

  res.json(expenses);
});

expenseRouter.put('/', async (req:Request, res:Response, next:NextFunction) => {
  const {
    accountId,
    name,
    categoryId,
    dateString,
    year,
    month,
    week,
    amount,
  } = req.body;

  const { valid, error } = validateExpense(req.body as Expense);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const expense:Expense|void = await query({
    name: 'expense-put',
    text: `INSERT INTO "expense" ("accountId","name","categoryId","dateString","year","month","week","amount","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now(),now())
           RETURNING *;`,
    values: [accountId, name, categoryId, dateString, year, month, week, amount],
  })
    .then(({ rows: [expense] }) => expense as Expense)
    .catch(next);

  return res.json(expense);
});

expenseRouter.post('/', async (req:Request, res:Response, next:NextFunction) => {
  const {
    id,
    accountId,
    name,
    categoryId,
    dateString,
    year,
    month,
    week,
    amount,
  } = req.body;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  const { valid, error } = validateExpense(req.body as Expense);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const expenseUpdated:boolean|void = await query({
    name: 'expense-post',
    text: `UPDATE "expense"
           SET "accountId"=$2,
               "name"=$3,
               "categoryId"=$4,
               "dateString"=$5,
               "year"=$6,
               "month"=$7,
               "week"=$8,
               "amount"=$9,
               "updatedAt"=now()
           WHERE id=$1;`,
    values: [id, accountId, name, categoryId, dateString, year, month, week, amount],
  })
    .then(({ rowCount }) => rowCount === 1)
    .catch(next);

  return res.json({
    success: expenseUpdated === true,
  });
});

expenseRouter.delete('/', async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.body;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  const expenseDeleted:boolean|void = await query({
    name: 'expense-delete',
    text: `DELETE FROM "expense"
           WHERE id=$1;`,
    values: [id],
  })
    .then(({ rowCount }) => rowCount === 1)
    .catch(next);

  return res.json({
    success: expenseDeleted === true,
  });
});

export default expenseRouter;
