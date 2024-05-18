import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import {
  findAllByAccountId,
  addCustomColor,
  updateColor,
  deleteColor,
} from '../../services/color';
import Color, { validateColor } from '../../types/Color';

const colorRouter = Router();

colorRouter.get('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const defaultColors:Color[] = await findAllByAccountId(null);
  const customColors:Color[] = await findAllByAccountId(accountId);

  res.json([
    ...defaultColors,
    ...customColors,
  ]);
});

colorRouter.put('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const {
    name,
    hex,
    red,
    green,
    blue,
    intensity,
  } = req.body;

  const colorToSave = {
    name,
    hex,
    red,
    green,
    blue,
    intensity,
  } as Color;

  const { valid, error } = validateColor(colorToSave);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const {
    success,
    color: savedColor,
  } = await addCustomColor(accountId, colorToSave);

  return res.json({
    success,
    color: savedColor,
  });
});

colorRouter.post('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const {
    id,
    name,
    hex,
    red,
    green,
    blue,
    intensity,
  } = req.body;

  const colorToUpdate = {
    id,
    name,
    hex,
    red,
    green,
    blue,
    intensity,
  } as Color;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  const { valid, error } = validateColor(colorToUpdate);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const colorUpdated:boolean|void = await updateColor(accountId, colorToUpdate);

  return res.json({
    success: colorUpdated === true,
  });
});

colorRouter.delete('/', async (req:Request, res:Response, next:NextFunction) => {
  const { auth: { id: accountId }} = <any>req;
  const { id } = req.body;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  const colorDeleted:boolean|void = await deleteColor(accountId, id);

  return res.json({
    success: colorDeleted === true,
  });
});

export default colorRouter;
