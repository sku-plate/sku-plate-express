import { Router } from 'express';
import AuthController from '../controllers/authController.js';
import RestaurantController from '../controllers/restaurantController.js';

const restaurantRouter = Router();
const authController = new AuthController();
const restaurantController = new RestaurantController();

restaurantRouter.get('/type/:typeOfFood', restaurantController.getOneTypeOfFoodRestaurants);
restaurantRouter.get('/search/:searchKeyword', restaurantController.searchRestaurant);
restaurantRouter.get('/bookmark', authController.verifyKakaoToken, restaurantController.getBookmarkedRestaurants);
restaurantRouter.get(
  '/:restaurantId/bookmark',
  authController.verifyKakaoToken,
  restaurantController.bookmarkRestaurant,
);
restaurantRouter.get('/:restaurantId', restaurantController.getRestaurant);
restaurantRouter.get('/', restaurantController.getAllRestaurants);
restaurantRouter.post('/', restaurantController.addRestaurant);

export default restaurantRouter;
