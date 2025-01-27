import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import {
  findAll,
  updateAccount,
  deleteAccount,
} from '../../services/account';
import Account, { validateAccount } from '../../types/Account';
import { deleteAllExpensesForAccount } from '../../services/expense';
import { deleteAllIncomesForAccount } from '../../services/income';
import { deleteAllInvestmentsForAccount } from '../../services/investment';
import { deleteAllSavingsForAccount } from '../../services/saving';
import { deleteAllExpensesTotalsForAccount } from '../../services/expensesTotals';
import { deleteAllIncomesTotalsForAccount } from '../../services/incomesTotals';
import { deleteAllSavingsTotalsForAccount } from '../../services/savingsTotals';
import { deleteAllInvestmentsTotalsForAccount } from '../../services/investmentsTotals';
import { deleteAllCategoriesForAccount } from '../../services/category';
import { deleteAllCustomColorsForAccount } from '../../services/color';

const accountRouter = Router();

accountRouter.get('/', async (req:Request, res:Response) => {
  const accounts:Account[] = await findAll();

  res.json(accounts);
});

accountRouter.post('/', async (req:Request, res:Response, next:NextFunction) => {
  const {
    id,
    firstName,
    lastName,
    language,
    currencyType,
    currencySymbol,
  } = req.body;

  const { auth: { id: authId }} = <any>req;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  if (authId !== id) {
    return res.json({
      success: false,
      error: `"id" doesn't match the authorized user`,
    });
  }

  const { valid, error } = validateAccount(req.body as Account);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const accountUpdated:boolean|void = await updateAccount({
    id,
    firstName,
    lastName,
    language,
    currencyType,
    currencySymbol,
  } as Account)
    .catch(next);

  return res.json({
    success: accountUpdated === true,
  });
});

accountRouter.delete('/', async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.body;
  const { auth: { id: authId }} = <any>req;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  if (authId !== id) {
    return res.json({
      success: false,
      error: `"id" doesn't match the authorized user`,
    });
  }

  let deletedExpensesCount = 0;
  let deletedIncomesCount = 0;
  let deletedSavingsCount = 0;
  let deletedInvestmentsCount = 0;

  let deletedExpensesTotalsCount = 0;
  let deletedIncomesTotalsCount = 0;
  let deletedSavingsTotalsCount = 0;
  let deletedInvestmentsTotalsCount = 0;

  let deletedCategoriesCount = 0;
  let deletedColorsCount = 0;

  let accountDeleted = false;

  try {
    // delete all transactions
    deletedExpensesCount = await deleteAllExpensesForAccount(id);
    deletedIncomesCount = await deleteAllIncomesForAccount(id);
    deletedSavingsCount = await deleteAllSavingsForAccount(id);
    deletedInvestmentsCount = await deleteAllInvestmentsForAccount(id);

    // delete all totals
    deletedExpensesTotalsCount = await deleteAllExpensesTotalsForAccount(id);
    deletedIncomesTotalsCount = await deleteAllIncomesTotalsForAccount(id);
    deletedSavingsTotalsCount = await deleteAllSavingsTotalsForAccount(id);
    deletedInvestmentsTotalsCount = await deleteAllInvestmentsTotalsForAccount(id);

    deletedCategoriesCount = await deleteAllCategoriesForAccount(id);
    deletedColorsCount = await deleteAllCustomColorsForAccount(id);

    accountDeleted = await deleteAccount(id);
  } catch (error) {
    console.error('Failed to fully delete an account and its data', error);
    return next(error);
  }

  return res.json({
    success: accountDeleted,

    deletedExpensesCount,
    deletedIncomesCount,
    deletedSavingsCount,
    deletedInvestmentsCount,
    deletedExpensesTotalsCount,
    deletedIncomesTotalsCount,
    deletedSavingsTotalsCount,
    deletedInvestmentsTotalsCount,
    deletedCategoriesCount,
    deletedColorsCount,
  });
});

export default accountRouter;
