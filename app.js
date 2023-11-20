import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import userRouter from './routes/userRouter.js';
import restaurantRouter from './routes/restaurantRouter.js';

dotenv.config({ path: './config.env' });

const app = express(); // express 서버 생성

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res) => {
  res.status(200).send('[muroom studio] Hello, world.');
});

app.use('/users', userRouter);
app.use('/restaurants', restaurantRouter);

export default app;
