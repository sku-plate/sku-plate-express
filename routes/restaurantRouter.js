import { Router } from 'express';
import AuthController from '../controllers/authController.js';
import RestaurantController from '../controllers/restaurantController.js';

const restaurantRouter = Router();
const authController = new AuthController();
const restaurantController = new RestaurantController();

restaurantRouter.get('/', restaurantController.getAllRestaurants);
restaurantRouter.post('/', restaurantController.addRestaurant);
restaurantRouter.get('/:typeOfFood', restaurantController.getOneTypeOfFoodRestaurants);
restaurantRouter.get('/search/:searchKeyword', restaurantController.searchRestaurant);

export default restaurantRouter;
