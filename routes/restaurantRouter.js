import { Router } from 'express';
import AuthController from '../controllers/authController.js';
import RestaurantController from '../controllers/restaurantController.js';

const restaurantRouter = Router();
const authController = new AuthController();
const restaurantController = new RestaurantController();

restaurantRouter.get('/', authController.verifyKakaoToken, restaurantController.getAllRestaurants);

export default restaurantRouter;
