import express, { Router } from 'express';
import { resolve } from 'path';

import multer from 'multer';
import multerConfig from './config/multerConfig';

import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import FileController from './controllers/FileController';
import AuthMiddleware from './middlewares/Auth';
import DriverController from './controllers/DriverController';
import VehicleController from './controllers/VehicleController';
import TripController from './controllers/TripController';

const upload = multer(multerConfig);

const routes = Router();

routes.post('/sessions', SessionController.store);
routes.use(
  '/uploads',
  express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
);

// AUTH MIDDLEWARE
routes.use(AuthMiddleware);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/users', UserController.store);
routes.put('/users/:_id', UserController.update);

routes.get('/drivers', DriverController.show);
routes.get('/drivers/:_id', DriverController.index);
routes.put('/drivers/:_id', DriverController.update);
routes.post('/drivers', DriverController.store);

routes.get('/vehicles', VehicleController.show);
routes.get('/vehicles/:_id', VehicleController.index);
routes.put('/vehicles/:_id', VehicleController.update);
routes.post('/vehicles', VehicleController.store);

routes.get('/trips', TripController.show);
routes.get('/trips/:_id', TripController.index);
routes.put('/trips/:_id', TripController.update);
routes.post('/trips', TripController.store);
export default routes;
