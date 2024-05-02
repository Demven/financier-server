import { query } from '../dal';
import Category from '../types/Category';

export async function findAllByAccountId (id:number):Promise<Category[]> {
  return query({
    name: 'category-get-all-by-account-id',
    text: 'SELECT * FROM category WHERE "accountId"=$1;',
    values: [id],
  })
    .then(({ rows }) => rows as Category[]);
}
