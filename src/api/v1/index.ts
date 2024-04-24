import { Router as router } from 'express';
import userRouter from './user';

const v1Router = router();

v1Router.get('/status', (req, res) => {
  res.send('Status: running');
});

v1Router.use('/user', userRouter);

export default v1Router;
