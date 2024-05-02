import { query } from '../dal';
import Saving from '../types/Saving';

export async function findAllByAccountIdForYear (id:number, year:number):Promise<Saving[]> {
  return query({
    name: `saving-get-all-by-account-id-${id}-for-year-${year}`,
    text: 'SELECT * FROM saving WHERE "accountId"=$1 AND "year"=$2;',
    values: [id, year],
  })
    .then(({ rows }) => rows as Saving[]);
}
