import { query } from '../dal';
import Category from '../types/Category';

export function findOneById (accountId:number, id:number):Promise<Category> {
  return query({
    name: `category-get-one-by-id-${id}-for-account-id-${accountId}`,
    text: 'SELECT * FROM "category" WHERE "accountId"=$1 AND "id"=$2;',
    values: [accountId, id],
  })
    .then(({ rows }) => rows[0] as Category);
}

export async function findAllByAccountId (accountId:number):Promise<Category[]> {
  return query({
    name: `category-get-all-by-account-${accountId}`,
    text: `SELECT *
           FROM "category"
           WHERE "accountId"=$1
           ORDER BY "id" ASC;`,
    values: [accountId],
  })
    .then(({ rows }) => rows as Category[]);
}

export async function addCategory (accountId:number, category:Category):Promise<{ success:boolean; category:Category|undefined; }> {
  const {
    name,
    description = '',
    colorId,
  } = category;

  return query({
    name: `category-add-for-account-${accountId}`,
    text: `INSERT INTO "category" ("accountId","name","description","colorId","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,now(),now())
           RETURNING *;`,
    values: [accountId, name, description, colorId],
  })
    .then(({ rows: [category] }) => category as Category)
    .then(async (category:Category) => {
      if (!category) {
        return {
          success: false,
          category: undefined,
        };
      }

      return {
        success: true,
        category,
      };
    });
}

export async function updateCategory (accountId:number, category:Category):Promise<boolean> {
  const {
    id,
    name,
    description = '',
    colorId,
  } = category;

  return query({
    name: `category-update-id-${id}`,
    text: `UPDATE "category"
           SET "accountId"=$2,
               "name"=$3,
               "description"=$4,
               "colorId"=$5,
               "updatedAt"=now()
           WHERE id=$1;`,
    values: [id, accountId, name, description, colorId],
  })
    .then(({ rowCount }) => rowCount === 1);
}

export async function deleteCategory (accountId:number, id:number):Promise<boolean> {
  return query({
    name: `category-delete-id-${id}`,
    text: `DELETE FROM "category"
           WHERE id=$1 AND "accountId"=$2;`,
    values: [id, accountId],
  })
    .then(({ rowCount }) => rowCount === 1);
}

export function deleteAllCategoriesForAccount (accountId:number):Promise<number> {
  return query({
    name: `category-delete-all-for-account-${accountId}`,
    text: `DELETE FROM "category"
           WHERE "accountId"=$1;`,
    values: [accountId],
  })
    .then(({ rowCount }) => rowCount);
}

