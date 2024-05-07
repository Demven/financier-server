import { Router as router } from 'express';
import authRouter from './auth';
import basicsRouter from './basics';
import overviewRouter from './overview';
import accountRouter from './account';
import categoryRouter from './category';
import colorRouter from './color';
import expenseRouter from './expense';
import incomeRouter from './income';
import savingRouter from './saving';
import investmentRouter from './investment';
import expensesTotalsRouter from './expensesTotals';
import incomesTotalsRouter from './incomesTotals';
import savingsTotalsRouter from './savingsTotals';
import investmentsTotalsRouter from './investmentsTotals';
import { authorizationChain } from '../middleware/authorization';

const v1Router = router();

v1Router.get('/status', (req, res) => {
  res.send('Status: running');
});

v1Router.use('/auth', authRouter);

// endpoints for aggregated data
v1Router.use('/basics', authorizationChain, basicsRouter); // account, colors, categories
v1Router.use('/overview', authorizationChain, overviewRouter); // expenses, savings, investments, incomes

v1Router.use('/account', authorizationChain, accountRouter);
v1Router.use('/category', authorizationChain, categoryRouter);
v1Router.use('/color', authorizationChain, colorRouter);
v1Router.use('/expense', authorizationChain, expenseRouter);
v1Router.use('/income', authorizationChain, incomeRouter);
v1Router.use('/saving', authorizationChain, savingRouter);
v1Router.use('/investment', authorizationChain, investmentRouter);

v1Router.use('/expensesTotals', authorizationChain, expensesTotalsRouter);
v1Router.use('/incomesTotals', authorizationChain, incomesTotalsRouter);
v1Router.use('/savingsTotals', authorizationChain, savingsTotalsRouter);
v1Router.use('/investmentsTotals', authorizationChain, investmentsTotalsRouter);

export default v1Router;
