import dotenv from 'dotenv';
import mongoose from 'mongoose';

import app from './app.js';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => console.log('[muroom studio] MongoDB connected.'));

// 서버 시작
const port = process.env.PORT || 8080;
const url = process.env.URL || `http://localhost:${port}`;
const server = app.listen(port, () => {
  console.log(
    `[muroom studio] Express server listening on port ${port} as ${process.env.NODE_ENV}\n[muroom studio] API: ${url}`
  );
});
