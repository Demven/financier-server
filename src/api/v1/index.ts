import { Router as router } from 'express';
import authRouter from './auth';
import overviewRouter from './overview';
import accountRouter from './account';
import categoryRouter from './category';
import colorRouter from './color';
import expenseRouter from './expense';
import incomeRouter from './income';
import savingRouter from './saving';
import investmentRouter from './investment';
import { authorizationChain } from '../middleware/authorization';

const v1Router = router();

v1Router.get('/status', (req, res) => {
  res.send('Status: running');
});

v1Router.use('/auth', authRouter);

v1Router.use('/overview', authorizationChain, overviewRouter);

v1Router.use('/account', authorizationChain, accountRouter);
v1Router.use('/category', authorizationChain, categoryRouter);
v1Router.use('/color', authorizationChain, colorRouter);
v1Router.use('/expense', authorizationChain, expenseRouter);
v1Router.use('/income', authorizationChain, incomeRouter);
v1Router.use('/saving', authorizationChain, savingRouter);
v1Router.use('/investment', authorizationChain, investmentRouter);

export default v1Router;
