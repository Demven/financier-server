import {
  Router,
  Request,
  Response,
} from 'express';
import jwt from 'jsonwebtoken';
import Account from '../../types/Account';
import * as accountService from '../../services/account';
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
  const { email, password } = req.body;

  if (!email?.length || !email.includes('@')) {
    return res.status(400).send('Email address is invalid');
  } else if (password?.length < 6) {
    return res.status(400).send('Password is invalid');
  }

  const account:Account = await accountService.findByEmailAndPassword(email, password);

  if (account && account.email === email) {
    return res.json({ token: getToken(account) });
  } else {
    return res.status(400).send('Wrong email or password');
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
    } else {
      return res.status(404).send('User not found');
    }
  } else {
    return res.status(400).send('Invalid token');
  }
});

export default authRouter;
