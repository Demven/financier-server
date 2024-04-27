import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import { query } from '../../dal';
import Account, { validateAccount } from '../../types/Account';

const accountRouter = Router();

accountRouter.get('/', async (req:Request, res:Response) => {
  const accounts:Account[] = await query({
    name: 'account-get-all',
    text: 'SELECT * FROM account',
  })
    .then(({ rows }) => rows as Account[]);

  res.json(accounts);
});

accountRouter.put('/', async (req:Request, res:Response, next:NextFunction) => {
  const {
    firstName,
    lastName,
    email,
    language,
    currencyType,
    currencySymbol,
  } = req.body;

  const { valid, error } = validateAccount(req.body as Account);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const account:Account|void = await query({
    name: 'account-put',
    text: `INSERT INTO "account" ("firstName","lastName","email","language","currencyType","currencySymbol","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,now(),now())
           RETURNING *;`,
    values: [firstName, lastName, email, language, currencyType, currencySymbol],
  })
    .then(({ rows: [account] }) => account as Account)
    .catch(next);

  return res.json(account);
});

accountRouter.post('/', async (req:Request, res:Response, next:NextFunction) => {
  const {
    id,
    firstName,
    lastName,
    email,
    language,
    currencyType,
    currencySymbol,
  } = req.body;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  const { valid, error } = validateAccount(req.body as Account);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const accountUpdated:boolean|void = await query({
    name: 'account-post',
    text: `UPDATE "account"
           SET "firstName"=$2,
               "lastName"=$3,
               "email"=$4,
               "language"=$5,
               "currencyType"=$6,
               "currencySymbol"=$7,
               "updatedAt"=now()
           WHERE id=$1;`,
    values: [id, firstName, lastName, email, language, currencyType, currencySymbol],
  })
    .then(({ rowCount }) => rowCount === 1)
    .catch(next);

  return res.json({
    success: accountUpdated === true,
  });
});

accountRouter.delete('/', async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.body;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  const accountDeleted:boolean|void = await query({
    name: 'account-delete',
    text: `DELETE FROM "account"
           WHERE id=$1;`,
    values: [id],
  })
    .then(({ rowCount }) => rowCount === 1)
    .catch(next);

  return res.json({
    success: accountDeleted === true,
  });
});

export default accountRouter;
