import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import { query } from '../../dal';
import Saving, { validateSaving } from '../../types/Saving';

const savingRouter = Router();

savingRouter.get('/', async (req:Request, res:Response) => {
  const savings = await query({
    name: 'saving-get-all',
    text: 'SELECT * FROM saving',
  })
    .then(({ rows }) => rows);

  res.json(savings);
});

savingRouter.put('/', async (req:Request, res:Response, next:NextFunction) => {
  const {
    accountId,
    name,
    dateString,
    year,
    month,
    week,
    amount,
  } = req.body;

  const { valid, error } = validateSaving(req.body as Saving);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const saving:Saving|void = await query({
    name: 'saving-put',
    text: `INSERT INTO "saving" ("accountId","name","dateString","year","month","week","amount","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7,now(),now())
           RETURNING *;`,
    values: [accountId, name, dateString, year, month, week, amount],
  })
    .then(({ rows: [saving] }) => saving as Saving)
    .catch(next);

  return res.json(saving);
});

savingRouter.post('/', async (req:Request, res:Response, next:NextFunction) => {
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

  const { valid, error } = validateSaving(req.body as Saving);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const savingUpdated:boolean|void = await query({
    name: 'saving-post',
    text: `UPDATE "saving"
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
    success: savingUpdated === true,
  });
});

savingRouter.delete('/', async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.body;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  const savingDeleted:boolean|void = await query({
    name: 'saving-delete',
    text: `DELETE FROM "saving"
           WHERE id=$1;`,
    values: [id],
  })
    .then(({ rowCount }) => rowCount === 1)
    .catch(next);

  return res.json({
    success: savingDeleted === true,
  });
});

export default savingRouter;
