import {
  Router,
  Request,
  Response,
} from 'express';
import jwt from 'jsonwebtoken';
import Account from '../../types/Account';
import * as accountService from '../../services/account';
import * as expensesTotalsService from '../../services/expensesTotals';
import * as incomesTotalsService from '../../services/incomesTotals';
import * as savingsTotalsService from '../../services/savingsTotals';
import * as investmentsTotalsService from '../../services/investmentsTotals';
import { CURRENCIES, CURRENCY_SYMBOL } from '../../utils/currency';
import TokenPayload from '../../types/TokenPayload';

const { JWT_SECRET } = process.env;

const authRouter = Router();

const ONE_DAY = 60 * 60 * 24;
const ONE_WEEK = 7 * ONE_DAY;

function getToken (account:Account):string {
  return jwt.sign(
    { id: account.id, email: account.email },
    <string>JWT_SECRET,
    { expiresIn: ONE_WEEK },
  );
}

function decodeToken (token:string):TokenPayload|null {
  let decodedPayload;
  try {
    decodedPayload = <TokenPayload>jwt.verify(token, <string>JWT_SECRET);
  } catch (error) {
    decodedPayload = null;
  }

  return decodedPayload;
}

authRouter.post('/sign-in', async (req:Request, res:Response) => {
  const {email, password} = req.body;

  if (!email?.length || !email.includes('@')) {
    return res.status(400).send('Email address is invalid');
  } else if (password?.length < 6) {
    return res.status(400).send('Password is invalid');
  }

  const account:Account = await accountService.findByEmailAndPassword(email, password);

  if (!account || account.email !== email) {
    return res.status(400).send('Wrong email or password');
  } else if (!account.isConfirmed) {
    return res.status(400).send('Please confirm your email address before signing-in');
  } else if (account.isReset) {
    return res.status(400).send('Please set the new password before signing-in');
  } else {
    return res.json({ token: getToken(account) });
  }
});

authRouter.post('/validate-token', async (req:Request, res:Response) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).send('You must provide a JWT token');
  }

  const tokenPayload:TokenPayload|null = decodeToken(token);
  if (tokenPayload) {
    const { id, email } = tokenPayload;

    const account:Account = await accountService.findById(id);

    if (account?.email === email) {
      return res.json({ success: true, payload: tokenPayload });
    } else if (!account.isConfirmed) {
      return res.status(400).send('Please confirm your email address before signing-in');
    } else if (account.isReset) {
      return res.status(400).send('Please set the new password before signing-in');
    } else {
      return res.status(404).send('User not found');
    }
  } else {
    return res.status(400).send('Invalid token');
  }
});

authRouter.put('/register', async (req:Request, res:Response) => {
  const {
    email,
    password,
    firstName,
    lastName,
    currencyType,
  } = req.body;

  let errorMessage = '';

  if (!email?.length || !email.includes('@')) {
    errorMessage = 'Email address is invalid';
  } else if (password?.length < 6) {
    errorMessage = 'Password is invalid';
  } else if (!firstName.trim().length) {
    errorMessage = 'First name cannot be empty';
  } else if (!lastName.trim().length) {
    errorMessage = 'Last name cannot be empty';
  } else if (!CURRENCIES.includes(currencyType)) {
    errorMessage = 'Currency is not supported';
  }

  if (errorMessage) {
    return res.json({
      success: false,
      error: errorMessage,
    });
  }

  const accountByEmail:Account = await accountService.findByEmail(email);

  if (accountByEmail) {
    return res.json({
      success: false,
      error: 'Account already exists',
    });
  }

  const accountToCreate = {
    firstName,
    lastName,
    email,
    password,
    currencyType,
    currencySymbol: CURRENCY_SYMBOL[currencyType],
    language: 'en',
  } as Account;

  const createdAccount:Account = await accountService.createAccount(accountToCreate);

  // create empty totals
  await Promise.all([
    expensesTotalsService.createExpensesTotals(createdAccount.id, {
      total: 0,
      yearAverage: 0,
      monthAverage: 0,
      weekAverage: 0,
    }),
    incomesTotalsService.createIncomesTotals(createdAccount.id, {
      total: 0,
      yearAverage: 0,
      monthAverage: 0,
      weekAverage: 0,
    }),
    savingsTotalsService.createSavingsTotals(createdAccount.id, {
      total: 0,
      yearAverage: 0,
      monthAverage: 0,
      weekAverage: 0,
    }),
    investmentsTotalsService.createInvestmentsTotals(createdAccount.id, {
      total: 0,
      yearAverage: 0,
      monthAverage: 0,
      weekAverage: 0,
    }),
  ]);

  return res.json({ success: true });
});

export default authRouter;
