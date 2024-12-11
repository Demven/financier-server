import {
  Router,
  Request,
  Response,
} from 'express';
import {
  findOneById,
  addCategory,
  deleteCategory,
  findAllByAccountId,
  updateCategory,
} from '../../services/category';
import Category, { validateCategory } from '../../types/Category';

const categoryRouter = Router();

categoryRouter.get('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const categories = await findAllByAccountId(accountId);

  res.json(categories);
});

categoryRouter.get('/:id', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;
  const { id: categoryId } = req.params;

  const category = await findOneById(accountId, Number(categoryId));

  res.json(category);
});

categoryRouter.put('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const {
    name,
    description,
    colorId,
  } = req.body;

  const categoryToSave:Category = {
    name,
    description,
    colorId,
  } as Category;

  const { valid, error } = validateCategory(categoryToSave);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const {
    success,
    category: savedCategory,
  } = await addCategory(accountId, categoryToSave);

  return res.json({
    success,
    category: savedCategory,
  });
});

categoryRouter.post('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;

  const {
    id,
    name,
    description,
    colorId,
  } = req.body;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  const categoryToUpdate:Category = {
    id,
    name,
    description,
    colorId,
  } as Category;

  const { valid, error } = validateCategory(categoryToUpdate);

  if (!valid) {
    return res.json({
      success: false,
      error,
    });
  }

  const categoryUpdated:boolean|void = await updateCategory(accountId, categoryToUpdate);

  return res.json({
    success: categoryUpdated === true,
  });
});

categoryRouter.delete('/', async (req:Request, res:Response) => {
  const { auth: { id: accountId }} = <any>req;
  const { id } = req.body;

  if (!id) {
    return res.json({
      success: false,
      error: `"id" is required`,
    });
  }

  const categoryDeleted:boolean|void = await deleteCategory(accountId, id);

  return res.json({
    success: categoryDeleted === true,
  });
});

export default categoryRouter;
