import { Request, Response, Router } from 'express';
import * as accountService from '../../services/account';
import * as colorService from '../../services/color';
import * as categoryService from '../../services/category';
import Account from '../../types/Account';
import Color from '../../types/Color';
import Category from '../../types/Category';

const basicsRouter = Router();

basicsRouter.get('/', async (req:Request, res:Response) => {
  const { auth: { id }} = <any>req;

  const account:Account = await accountService.findById(id);
  const defaultColors:Color[] = await colorService.findAllByAccountId(null);
  const customColors:Color[] = await colorService.findAllByAccountId(id);
  const categories:Category[] = await categoryService.findAllByAccountId(id);

  delete account.password;

  res.json({
    account,
    colors: [
      ...defaultColors,
      ...customColors,
    ],
    categories,
  });
});

export default basicsRouter;
