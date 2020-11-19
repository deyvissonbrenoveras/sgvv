import express from 'express';
import { config } from 'dotenv';
import mongoose from 'mongoose';
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

app.use(routes);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running at port ${process.env.SERVER_PORT}.`);
});
