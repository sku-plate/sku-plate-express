import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import userRouter from './routes/userRouter.js';
import restaurantRouter from './routes/restaurantRouter.js';

dotenv.config({ path: './config.env' });

const app = express(); // express 서버 생성

app.use(cors());
// CORS 설정: 'asdf.com' 도메인만 허용
// const corsOptions = {
//   origin: 'http://asdf.com',
// };
app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res) => {
  res.status(200).send('[muroom studio] Hello, world.');
});

app.use('/users', userRouter);
app.use('/restaurants', restaurantRouter);

export default app;
