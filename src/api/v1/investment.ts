import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import { query } from '../../dal';
import Investment, { validateInvestment } from '../../types/Investment';

const investmentRouter = Router();

investmentRouter.get('/', async (req:Request, res:Response) => {
  const investments = await query({
    name: 'investment-get-all',
    text: 'SELECT * FROM investment',
  })
    .then(({ rows }) => rows);

  res.json(investments);
});

investmentRouter.put('/', async (req:Request, res:Response, next:NextFunction) => {
  const {
    accountId,
    name,
    dateString,
    year,
    month,
    week,
    ticker,
    shares,
    pricePerShare,
  } = req.body;

  const { valid, error } = validateInvestment(req.body as Investment);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const investment:Investment|void = await query({
    name: 'investment-put',
    text: `INSERT INTO "investment" ("accountId","name","dateString","year","month","week","ticker","shares","pricePerShare","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,now(),now())
           RETURNING *;`,
    values: [accountId, name, dateString, year, month, week, ticker, shares, pricePerShare],
  })
    .then(({ rows: [investment] }) => investment as Investment)
    .catch(next);

  return res.json(investment);
});

investmentRouter.post('/', async (req:Request, res:Response, next:NextFunction) => {
  const {
    id,
    accountId,
    name,
    dateString,
    year,
    month,
    week,
    ticker,
    shares,
    pricePerShare,
  } = req.body;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  const { valid, error } = validateInvestment(req.body as Investment);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const investmentUpdated:boolean|void = await query({
    name: 'investment-post',
    text: `UPDATE "investment"
           SET "accountId"=$2,
               "name"=$3,
               "dateString"=$4,
               "year"=$5,
               "month"=$6,
               "week"=$7,
               "ticker"=$8,
               "shares"=$9,
               "pricePerShare"=$10,
               "updatedAt"=now()
           WHERE id=$1;`,
    values: [id, accountId, name, dateString, year, month, week, ticker, shares, pricePerShare],
  })
    .then(({ rowCount }) => rowCount === 1)
    .catch(next);

  return res.json({
    success: investmentUpdated === true,
  });
});

investmentRouter.delete('/', async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.body;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  const investmentDeleted:boolean|void = await query({
    name: 'investment-delete',
    text: `DELETE FROM "investment"
           WHERE id=$1;`,
    values: [id],
  })
    .then(({ rowCount }) => rowCount === 1)
    .catch(next);

  return res.json({
    success: investmentDeleted === true,
  });
});

export default investmentRouter;
