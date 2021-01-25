import express from 'express';
import 'dotenv/config';
import compression from 'compression';
import { resolve } from 'path';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes';

class App {
  constructor() {
    this.server = express();
    this.database();
    this.middlewares();
    this.routes();
  }

  database() {
    mongoose.connect(
      'mongodb://localhost/sgvv',
      { useNewUrlParser: true, useUnifiedTopology: true },
      (error) => {
        if (error) {
          console.log('Error while connecting database');
        }
      }
    );
  }

  middlewares() {
    this.server.use(compression());

    this.server.use(
      cors({ origin: ['http://localhost:3000', 'http://192.168.0.91:3000'] })
    );

    this.server.use(express.json());

    this.server.use(
      '/uploads',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );

    // FRONTEND REACT
    this.server.use(express.static(resolve(__dirname, '../client')));
  }

  routes() {
    this.server.use('/api', routes);

    // FRONTEND REACT
    this.server.get('/*', (req, res) => {
      res.sendFile(resolve(__dirname, '../client/index.html'));
    });
  }
}

export default new App().server;
