import express from 'express';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes';

config();

const app = express();

mongoose.connect(
  'mongodb://localhost/sgvv',
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) => {
    if (error) {
      console.log('Error while connection database');
    }
  }
);

app.use(
  cors({ origin: ['http://localhost:3000', 'http://192.168.0.91:3000'] })
);

app.use(express.json(), routes);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running at port ${process.env.SERVER_PORT}.`);
});
