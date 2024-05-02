import { Request, Response, Router } from 'express';
import * as colorService from '../../services/color';
import * as categoryService from '../../services/category';
import * as expenseService from '../../services/expense';
import { groupItemsByYearMonthWeek } from '../../services/items';
import Color from '../../types/Color';
import Category from '../../types/Category';
import Expense from '../../types/Expense';

const overviewRouter = Router();

overviewRouter.get('/', async (req:Request, res:Response) => {
  const { auth: { id }} = <any>req;

  const year = Number(req.query.year)
    ? Number(req.query.year)
    : new Date().getFullYear();

  const defaultColors:Color[] = await colorService.findAllByAccountId(null);
  const customColors:Color[] = await colorService.findAllByAccountId(id);
  const categories:Category[] = await categoryService.findAllByAccountId(id);

  // TODO: year
  const expenses:Expense[] = await expenseService.findAllByAccountIdForYear(id, year - 1);
  const expensesGroupedByYearMonthWeek = groupItemsByYearMonthWeek(expenses);

  res.json({
    colors: [
      ...defaultColors,
      ...customColors,
    ],
    categories,
    expenses: expensesGroupedByYearMonthWeek,
  });
});

export default overviewRouter;
