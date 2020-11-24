import express, { Router } from 'express';
import path from 'path';

import multer from 'multer';
import multerConfig from './config/multerConfig';

import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import FileController from './controllers/FileController';
import AuthMiddleware from './middlewares/Auth';
import DriverController from './controllers/DriverController';

const upload = multer(multerConfig);

const routes = Router();

routes.post('/sessions', SessionController.store);
routes.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// AUTH MIDDLEWARE
routes.use(AuthMiddleware);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/users', UserController.store);
routes.put('/users/:_id', UserController.update);

routes.get('/drivers', DriverController.show);
routes.get('/drivers/:_id', DriverController.index);
routes.put('/drivers/:_id', DriverController.update);
routes.post('/drivers', DriverController.store);
export default routes;
