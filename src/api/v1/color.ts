import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import { query } from '../../dal';
import Color, { validateColor } from '../../types/Color';

const colorRouter = Router();

colorRouter.get('/', async (req:Request, res:Response) => {
  const colors = await query({
    name: 'color-get-all',
    text: 'SELECT * FROM color',
  })
    .then(({ rows }) => rows);

  res.json(colors);
});

colorRouter.put('/', async (req:Request, res:Response, next:NextFunction) => {
  const {
    accountId,
    name,
    hex,
    red,
    green,
    blue,
    intensity,
  } = req.body;

  const { valid, error } = validateColor(req.body as Color);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const color:Color|void = await query({
    name: 'color-put',
    text: `INSERT INTO "color" ("accountId","name","hex","red","green","blue","intensity","custom","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now(),now())
           RETURNING *;`,
    values: [accountId, name, hex, red, green, blue, intensity, true], // all new colors are "custom" by default
  })
    .then(({ rows: [color] }) => color as Color)
    .catch(next);

  return res.json(color);
});

colorRouter.post('/', async (req:Request, res:Response, next:NextFunction) => {
  const {
    id,
    accountId,
    name,
    hex,
    red,
    green,
    blue,
    intensity,
  } = req.body;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  const { valid, error } = validateColor(req.body as Color);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const colorUpdated:boolean|void = await query({
    name: 'color-post',
    text: `UPDATE "color"
           SET "accountId"=$2,
               "name"=$3,
               "hex"=$4,
               "red"=$5,
               "green"=$6,
               "blue"=$7,
               "intensity"=$8,
               "updatedAt"=now()
           WHERE id=$1;`,
    values: [id, accountId, name, hex, red, green, blue, intensity],
  })
    .then(({ rowCount }) => rowCount === 1)
    .catch(next);

  return res.json({
    success: colorUpdated === true,
  });
});

colorRouter.delete('/', async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.body;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  const colorDeleted:boolean|void = await query({
    name: 'color-delete',
    text: `DELETE FROM "color"
           WHERE id=$1;`,
    values: [id],
  })
    .then(({ rowCount }) => rowCount === 1)
    .catch(next);

  return res.json({
    success: colorDeleted === true,
  });
});

export default colorRouter;
