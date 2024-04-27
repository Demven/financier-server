import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import { query } from '../../dal';
import Income, { validateIncome } from '../../types/Income';

const incomeRouter = Router();

incomeRouter.get('/', async (req:Request, res:Response) => {
  const incomes = await query({
    name: 'income-get-all',
    text: 'SELECT * FROM income',
  })
    .then(({ rows }) => rows);

  res.json(incomes);
});

incomeRouter.put('/', async (req:Request, res:Response, next:NextFunction) => {
  const {
    accountId,
    name,
    dateString,
    year,
    month,
    week,
    amount,
  } = req.body;

  const { valid, error } = validateIncome(req.body as Income);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const income:Income|void = await query({
    name: 'income-put',
    text: `INSERT INTO "income" ("accountId","name","dateString","year","month","week","amount","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7,now(),now())
           RETURNING *;`,
    values: [accountId, name, dateString, year, month, week, amount],
  })
    .then(({ rows: [income] }) => income as Income)
    .catch(next);

  return res.json(income);
});

incomeRouter.post('/', async (req:Request, res:Response, next:NextFunction) => {
  const {
    id,
    accountId,
    name,
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

  const { valid, error } = validateIncome(req.body as Income);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const incomeUpdated:boolean|void = await query({
    name: 'income-post',
    text: `UPDATE "income"
           SET "accountId"=$2,
               "name"=$3,
               "dateString"=$4,
               "year"=$5,
               "month"=$6,
               "week"=$7,
               "amount"=$8,
               "updatedAt"=now()
           WHERE id=$1;`,
    values: [id, accountId, name, dateString, year, month, week, amount],
  })
    .then(({ rowCount }) => rowCount === 1)
    .catch(next);

  return res.json({
    success: incomeUpdated === true,
  });
});

incomeRouter.delete('/', async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.body;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  const incomeDeleted:boolean|void = await query({
    name: 'income-delete',
    text: `DELETE FROM "income"
           WHERE id=$1;`,
    values: [id],
  })
    .then(({ rowCount }) => rowCount === 1)
    .catch(next);

  return res.json({
    success: incomeDeleted === true,
  });
});

export default incomeRouter;
