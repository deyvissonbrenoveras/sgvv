import { Router } from 'express';
import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import AuthMiddleware from './middlewares/Auth';

const routes = Router();

routes.post('/sessions', SessionController.store);

// AUTH MIDDLEWARE
routes.use(AuthMiddleware);

routes.post('/users', UserController.store);
routes.put('/users/:_id', UserController.update);

export default routes;
