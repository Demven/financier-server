import { Request, Response, Router } from 'express';
import * as expenseService from '../../services/expense';
import * as incomeService from '../../services/income';
import * as savingService from '../../services/saving';
import * as investmentService from '../../services/investment';
import { groupItemsByYearMonthWeek } from '../../services/items';
import Expense from '../../types/Expense';
import Income from '../../types/Income';
import Saving from '../../types/Saving';
import Investment from '../../types/Investment';
import GroupedItems from '../../types/GroupedItems';

const overviewRouter = Router();

overviewRouter.get('/', async (req:Request, res:Response) => {
  const { auth: { id }} = <any>req;

  const year = Number(req.query.year)
    ? Number(req.query.year)
    : new Date().getFullYear();

  const expenses:Expense[] = await expenseService.findAllByAccountIdForYear(id, year);
  const expensesGroupedByYearMonthWeek:GroupedItems = groupItemsByYearMonthWeek(expenses);

  const incomes:Income[] = await incomeService.findAllByAccountIdForYear(id, year);
  const incomesGroupedByYearMonthWeek:GroupedItems = groupItemsByYearMonthWeek(incomes);

  const savings:Saving[] = await savingService.findAllByAccountIdForYear(id, year);
  const savingsGroupedByYearMonthWeek:GroupedItems = groupItemsByYearMonthWeek(savings);

  const investment:Investment[] = await investmentService.findAllByAccountIdForYear(id, year);
  const investmentsGroupedByYearMonthWeek:GroupedItems = groupItemsByYearMonthWeek(investment);

  res.json({
    year,
    expenses: expensesGroupedByYearMonthWeek,
    incomes: incomesGroupedByYearMonthWeek,
    savings: savingsGroupedByYearMonthWeek,
    investments: investmentsGroupedByYearMonthWeek,
  });
});

export default overviewRouter;
