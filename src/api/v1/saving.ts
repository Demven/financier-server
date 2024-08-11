import {
  Router,
  Request,
  Response,
} from 'express';
import {
  findAllByAccountIdForYear,
  addSaving,
  updateSaving,
  deleteSaving,
} from '../../services/saving';
import { groupItemsByYearMonthWeek } from '../../services/items';
import Saving, { validateSaving } from '../../types/Saving';
import GroupedItems from '../../types/GroupedItems';

const savingRouter = Router();

savingRouter.get('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const year = Number(req.query.year)
    ? Number(req.query.year)
    : new Date().getFullYear();

  const savings = await findAllByAccountIdForYear(accountId, year);
  const savingsGroupedByYearMonthWeek:GroupedItems = groupItemsByYearMonthWeek(savings);

  res.json(savingsGroupedByYearMonthWeek);
});

savingRouter.put('/', async (req:Request, res:Response) => {
  const {
    name,
    dateString,
    year,
    month,
    week,
    amount,
  } = req.body;

  const { auth: { id: accountId }} = <any>req;

  const saving:Saving = {
    name,
    dateString,
    year,
    month,
    week,
    amount,
  } as Saving;

  const { valid, error } = validateSaving(saving);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const {
    success,
    saving: savedSaving,
    totals,
  } = await addSaving(accountId, saving);

  return res.json({
    success,
    saving: savedSaving,
    totals,
  });
});

savingRouter.post('/', async (req:Request, res:Response) => {
  const {
    id,
    name,
    dateString,
    year,
    month,
    week,
    amount,
  } = req.body;

  const { auth: { id: accountId }} = <any>req;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  const saving:Saving = {
    id,
    name,
    dateString,
    year,
    month,
    week,
    amount,
  } as Saving;

  const { valid, error } = validateSaving(saving);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const {
    success,
    totals,
  } = await updateSaving(accountId, saving);

  return res.json({
    success,
    totals,
  });
});

savingRouter.delete('/', async (req:Request, res:Response) => {
  const { id } = req.body;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  const { auth: { id: accountId }} = <any>req;

  const {
    success,
    totals,
  } = await deleteSaving(accountId, id);

  return res.json({
    success,
    totals,
  });
});

export default savingRouter;
