import { Router as router } from 'express';
import accountRouter from './account';
import categoryRouter from './category';
import colorRouter from './color';
import expenseRouter from './expense';
import incomeRouter from './income';
import savingRouter from './saving';
import investmentRouter from './investment';

const v1Router = router();

v1Router.get('/status', (req, res) => {
  res.send('Status: running');
});

v1Router.use('/account', accountRouter);
v1Router.use('/category', categoryRouter);
v1Router.use('/color', colorRouter);
v1Router.use('/expense', expenseRouter);
v1Router.use('/income', incomeRouter);
v1Router.use('/saving', savingRouter);
v1Router.use('/investment', investmentRouter);

export default v1Router;
