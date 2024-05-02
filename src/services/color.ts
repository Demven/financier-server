import { query } from '../dal';
import Color from '../types/Color';

export async function findAllByAccountId (id:number|null):Promise<Color[]> {
  return query({
    name: `color-get-all-by-account-id-${id}`,
    text: `SELECT * FROM color WHERE ${id ? '"accountId"=$1' : '"accountId" is null'};`,
    values: id ? [id] : undefined,
  })
    .then(({ rows }) => rows as Color[]);
}
