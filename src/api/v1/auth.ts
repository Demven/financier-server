import {
  Router,
  Request,
  Response,
} from 'express';
import jwt from 'jsonwebtoken';
import Account from '../../types/Account';
import * as accountService from '../../services/account';
import * as categoryService from '../../services/category';
import * as expensesTotalsService from '../../services/expensesTotals';
import * as incomesTotalsService from '../../services/incomesTotals';
import * as savingsTotalsService from '../../services/savingsTotals';
import * as investmentsTotalsService from '../../services/investmentsTotals';
import { CURRENCIES, CURRENCY_SYMBOL } from '../../utils/currency';
import { sendTemplateEmail, EMAIL_TEMPLATE } from '../../services/email';
import SignInTokenPayload from '../../types/SignInTokenPayload';
import ConfirmEmailTokenPayload from '../../types/ConfirmEmailTokenPayload';
import ResetPasswordTokenPayload from '../../types/ResetPasswordTokenPayload';
import Category from '../../types/Category';

const {
  UI_HOST,
  JWT_SECRET,
} = process.env;

const authRouter = Router();

const ONE_DAY = 60 * 60 * 24;
const ONE_WEEK = 7 * ONE_DAY;

function getSignInToken (account:Account):string {
  return jwt.sign(
    {
      id: account.id,
      email: account.email,
      signedInDate: +(new Date()),
    },
    <string>JWT_SECRET,
    { expiresIn: ONE_WEEK },
  );
}

function getConfirmationToken (account:Account):string {
  return jwt.sign(
    {
      id: account.id,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
    },
    <string>JWT_SECRET,
    { expiresIn: 3 * ONE_DAY },
  );
}

function getResetPasswordToken (email:string):string {
  return jwt.sign(
    { email },
    <string>JWT_SECRET,
    { expiresIn: 3 * ONE_DAY },
  );
}

function decodeToken (token:string):SignInTokenPayload|ConfirmEmailTokenPayload|null {
  let decodedPayload;
  try {
    decodedPayload = <SignInTokenPayload|ConfirmEmailTokenPayload>jwt.verify(token, <string>JWT_SECRET);
  } catch (error) {
    decodedPayload = null;
  }

  return decodedPayload;
}

authRouter.post('/sign-in', async (req:Request, res:Response) => {
  const { email, password } = req.body;

  if (!email?.length || !email.includes('@')) {
    return res.status(400).send('Email address is invalid');
  } else if (password?.length < 6) {
    return res.status(400).send('Password is invalid');
  }

  const account:Account = await accountService.findByEmailAndPassword(email, password);

  if (!account || account.email !== email) {
    return res.status(400).send('Wrong email or password');
  } else if (!account.isConfirmed) {
    return res.status(400).send('Confirm your email address before signing in');
  } else if (account.isReset) {
    return res.status(400).send('Set the new password before signing in');
  } else {
    return res.json({ token: getSignInToken(account) });
  }
});

authRouter.post('/validate-token', async (req:Request, res:Response) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).send('You must provide a JWT token');
  }

  const tokenPayload:SignInTokenPayload|null = decodeToken(token);
  if (tokenPayload) {
    const { id, email } = tokenPayload;

    const account:Account = await accountService.findById(id);

    if (account?.email === email) {
      return res.json({
        success: true,
        payload: tokenPayload,
        refreshToken: getSignInToken(account),
      });
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

  const token = getConfirmationToken(createdAccount);

  const { Message: emailStatus } = await sendTemplateEmail(EMAIL_TEMPLATE.CONFIRM_EMAIL, {
    fromEmail: 'noreply@thefinancier.app',
    toEmail: email,
    fullName: `${firstName} ${lastName}`,
    actionUrl: `${UI_HOST}/confirm-email?token=${token}`,
  })
    .catch((error) => {
      console.error(error);
      return { Message: error.message };
    });

  if (emailStatus !== 'OK') {
    return res.json({ success: false, error: emailStatus });
  }

  return res.json({ success: true });
});

authRouter.post('/confirm-email', async (req:Request, res:Response) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).send('You must provide a JWT token as a body parameter "token"');
  }

  const tokenPayload:ConfirmEmailTokenPayload|null = <ConfirmEmailTokenPayload>decodeToken(token);
  if (tokenPayload) {
    const {
      id,
      email,
      firstName,
      lastName,
    } = tokenPayload;

    const account:Account = await accountService.findById(id);

    if (account.isConfirmed) {
      return res.json({
        success: false,
        error: 'Email is already confirmed. Please sign in.',
      });
    }

    if (account && account.email === email && account.firstName === firstName && account.lastName === lastName) {
      const confirmed = await accountService.confirmEmail(id, email);

      await createDataForNewUser(account.id);

      return res.json({ success: confirmed, payload: tokenPayload });
    } else {
      return res.json({
        success: false,
        error: 'User not found',
      });
    }
  } else {
    return res.json({
      success: false,
      error: 'Invalid token',
    });
  }
});

authRouter.post('/reset-password', async (req:Request, res:Response) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).send('You must provide an email address as a body parameter "email"');
  }

  const account:Account = await accountService.findByEmail(email);

  if (!account) {
    return res.json({
      success: false,
      error: 'User not found',
    });
  }

  const reset:boolean = await accountService.resetPassword(account.id);

  const token = getResetPasswordToken(email);

  const { Message: emailStatus } = await sendTemplateEmail(EMAIL_TEMPLATE.RESET_PASSWORD, {
    fromEmail: 'noreply@thefinancier.app',
    toEmail: email,
    fullName: `${account.firstName} ${account.lastName}`,
    actionUrl: `${UI_HOST}/reset-password?token=${token}`,
  })
    .catch((error) => {
      console.error(error);
      return { Message: error.message };
    });

  if (emailStatus !== 'OK') {
    return res.json({ success: false, error: emailStatus });
  }

  return res.json({ success: reset });
});

authRouter.post('/set-up-new-password', async (req:Request, res:Response) => {
  const { token, password } = req.body;

  if (!token) {
    return res.status(400).send('You must provide a JWT token as a body parameter "token"');
  }
  if (!password) {
    return res.status(400).send('You must provide the new password as a body parameter "password"');
  }

  const tokenPayload:ResetPasswordTokenPayload|null = <ResetPasswordTokenPayload>decodeToken(token);
  if (tokenPayload) {
    const { email } = tokenPayload;

    const account:Account = await accountService.findByEmail(email);

    if (!account) {
      return res.json({
        success: false,
        error: 'User not found',
      });
    }

    const success:boolean = await accountService.setUpNewPassword(account.id, password);

    return res.json({ success });
  } else {
    return res.json({
      success: false,
      error: 'Invalid token',
    });
  }
});

async function createDataForNewUser (accountId:number) {
  // create empty totals
  await Promise.all([
    expensesTotalsService.createExpensesTotals(accountId, {
      total: 0,
      yearAverage: 0,
      monthAverage: 0,
      weekAverage: 0,
    }),
    incomesTotalsService.createIncomesTotals(accountId, {
      total: 0,
      yearAverage: 0,
      monthAverage: 0,
      weekAverage: 0,
    }),
    savingsTotalsService.createSavingsTotals(accountId, {
      total: 0,
      yearAverage: 0,
      monthAverage: 0,
      weekAverage: 0,
    }),
    investmentsTotalsService.createInvestmentsTotals(accountId, {
      total: 0,
      yearAverage: 0,
      monthAverage: 0,
      weekAverage: 0,
    }),
  ]);

  // create default categories
  // see sql/1-init.sql and use teh same values
  await categoryService.addCategory(accountId, {
    name: 'Primary Expenses',
    description: 'Food, clothes, transport, medicine, bills, gym, etc.',
    colorId: 1,
  } as Category);
  await categoryService.addCategory(accountId, {
    name: 'Secondary Expenses',
    description: 'Home goods, furniture, renovation, car, hobbies, etc.',
    colorId: 2,
  } as Category);
  await categoryService.addCategory(accountId, {
    name: 'Housing',
    description: 'Mortgage, rent, insurance, etc.',
    colorId: 3,
  } as Category);
  await categoryService.addCategory(accountId, {
    name: 'Major',
    description: 'Traveling, expensive purchases',
    colorId: 4,
  } as Category);
  await categoryService.addCategory(accountId, {
    name: 'Entertainment',
    description: 'Dining, bars, night clubs, concerts, casual trips, etc.',
    colorId: 5,
  } as Category);
  await categoryService.addCategory(accountId, {
    name: 'Gifts & Charity',
    description: 'Donations, presents, street musicians, etc.',
    colorId: 6,
  } as Category);
}

export default authRouter;
