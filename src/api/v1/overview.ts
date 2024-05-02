import { Request, Response, Router } from 'express';
import * as colorService from '../../services/color';
import * as categoryService from '../../services/category';
import Color from '../../types/Color';
import Category from '../../types/Category';

const overviewRouter = Router();

overviewRouter.get('/', async (req:Request, res:Response) => {
  const { auth: { id }} = <any>req;

  const defaultColors:Color[] = await colorService.findAllByAccountId(null);
  const customColors:Color[] = await colorService.findAllByAccountId(id);
  const categories:Category[] = await categoryService.findAllByAccountId(id);

  res.json({
    colors: [
      ...defaultColors,
      ...customColors,
    ],
    categories,
  });
});

export default overviewRouter;
