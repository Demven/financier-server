import { query } from '../dal';
import Color from '../types/Color';

export async function findAllByAccountId (id:number|null):Promise<Color[]> {
  return query({
    name: `color-get-all-by-account-id-${id}`,
    text: `SELECT * 
           FROM "color"
           WHERE ${id ? '"accountId"=$1' : '"accountId" is null'}
           ORDER BY "id" ASC;`,
    values: id ? [id] : undefined,
  })
    .then(({ rows }) => rows as Color[]);
}

export async function addCustomColor (accountId:number, color:Color):Promise<{ success:boolean; color:Color|undefined; }> {
  const {
    name,
    hex,
    red,
    green,
    blue,
    intensity,
  } = color;

  const custom = true;

  return query({
    name: `color-add-for-account-${accountId}`,
    text: `INSERT INTO "color" ("accountId","name","hex","red","green","blue","intensity","custom","createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now(),now())
           RETURNING *;`,
    values: [accountId, name, hex, red, green, blue, intensity, custom],
  })
    .then(({ rows: [color] }) => color as Color)
    .then(async (color:Color) => {
      if (!color) {
        return {
          success: false,
          color: undefined,
        };
      }

      return {
        success: true,
        color,
      };
    });
}

export async function updateColor (accountId:number, color:Color):Promise<boolean> {
  const {
    id,
    name,
    hex,
    red,
    green,
    blue,
    intensity,
  } = color;

  return query({
    name: `color-update-id-${id}`,
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
    .then(({ rowCount }) => rowCount === 1);
}

export async function deleteColor (accountId:number, id:number):Promise<boolean> {
  return query({
    name: `color-delete-id-${id}`,
    text: `DELETE FROM "color"
           WHERE id=$1 AND "accountId"=$2;`,
    values: [id, accountId],
  })
    .then(({ rowCount }) => rowCount === 1);
}
