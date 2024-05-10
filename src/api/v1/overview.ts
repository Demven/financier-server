import { Request, Response, Router } from 'express';
import * as expenseService from '../../services/expense';
import * as expensesTotalsService from '../../services/expensesTotals';
import * as incomeService from '../../services/income';
import * as incomesTotalsService from '../../services/incomesTotals';
import * as savingService from '../../services/saving';
import * as savingsTotalsService from '../../services/savingsTotals';
import * as investmentService from '../../services/investment';
import * as investmentsTotalsService from '../../services/investmentsTotals';
import { groupItemsByYearMonthWeek } from '../../services/items';
import Expense from '../../types/Expense';
import Income from '../../types/Income';
import Saving from '../../types/Saving';
import Investment from '../../types/Investment';
import GroupedItems from '../../types/GroupedItems';
import Totals from '../../types/Totals';

const overviewRouter = Router();

overviewRouter.get('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const year = Number(req.query.year)
    ? Number(req.query.year)
    : new Date().getFullYear();

  const expenses:Expense[] = await expenseService.findAllByAccountIdForYear(accountId, year);
  const expensesGroupedByYearMonthWeek:GroupedItems = groupItemsByYearMonthWeek(expenses);

  const expensesTotals:Totals = await expensesTotalsService.getExpensesTotals(accountId);

  const incomes:Income[] = await incomeService.findAllByAccountIdForYear(accountId, year);
  const incomesGroupedByYearMonthWeek:GroupedItems = groupItemsByYearMonthWeek(incomes);

  const incomesTotals:Totals = await incomesTotalsService.getIncomesTotals(accountId);

  const savings:Saving[] = await savingService.findAllByAccountIdForYear(accountId, year);
  const savingsGroupedByYearMonthWeek:GroupedItems = groupItemsByYearMonthWeek(savings);

  const savingsTotals:Totals = await savingsTotalsService.getSavingsTotals(accountId);

  const investment:Investment[] = await investmentService.findAllByAccountIdForYear(accountId, year);
  const investmentsGroupedByYearMonthWeek:GroupedItems = groupItemsByYearMonthWeek(investment);

  const investmentsTotals:Totals = await investmentsTotalsService.getInvestmentsTotals(accountId);

  res.json({
    year,
    expenses: expensesGroupedByYearMonthWeek,
    expensesTotals,
    incomes: incomesGroupedByYearMonthWeek,
    incomesTotals,
    savings: savingsGroupedByYearMonthWeek,
    savingsTotals,
    investments: investmentsGroupedByYearMonthWeek,
    investmentsTotals,
  });
});

export default overviewRouter;
