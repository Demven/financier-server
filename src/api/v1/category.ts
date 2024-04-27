import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import { query } from '../../dal';
import Category, { validateCategory } from '../../types/Category';

const categoryRouter = Router();

categoryRouter.get('/', async (req:Request, res:Response) => {
  const categories = await query({
    name: 'category-get-all',
    text: 'SELECT * FROM category',
  })
    .then(({ rows }) => rows);

  res.json(categories);
});

categoryRouter.put('/', async (req:Request, res:Response, next:NextFunction) => {
  const {
    accountId,
    name,
    description,
    colorId,
  } = req.body;

  const { valid, error } = validateCategory(req.body as Category);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const category:Category|void = await query({
    name: 'category-put',
    text: `INSERT INTO "category" ("accountId","name","description","colorId","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,now(),now())
           RETURNING *;`,
    values: [accountId, name, description, colorId],
  })
    .then(({ rows: [category] }) => category as Category)
    .catch(next);

  return res.json(category);
});

categoryRouter.post('/', async (req:Request, res:Response, next:NextFunction) => {
  const {
    id,
    accountId,
    name,
    description,
    colorId,
  } = req.body;

  const { valid, error } = validateCategory(req.body as Category);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const categoryUpdated:boolean|void = await query({
    name: 'category-post',
    text: `UPDATE "category"
           SET "accountId"=$2,
               "name"=$3,
               "description"=$4,
               "colorId"=$5,
               "updatedAt"=now()
           WHERE id=$1;`,
    values: [id, accountId, name, description, colorId],
  })
    .then(({ rowCount }) => rowCount === 1)
    .catch(next);

  return res.json({
    success: categoryUpdated === true,
  });
});

categoryRouter.delete('/', async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.body;

  const categoryDeleted:boolean|void = await query({
    name: 'category-delete',
    text: `DELETE FROM "category"
           WHERE id=$1;`,
    values: [id],
  })
    .then(({ rowCount }) => rowCount === 1)
    .catch(next);

  return res.json({
    success: categoryDeleted === true,
  });
});

export default categoryRouter;
