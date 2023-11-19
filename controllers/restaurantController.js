import dotenv from 'dotenv';
import Restaurant from '../models/restaurantModel.js';

dotenv.config({ path: './config.env' });

class RestaurantController {
  addRestaurant = async (req, res) => {
    const { name, location, menu, images } = req.body;

    const newRestaurant = await Restaurant.create({ name, location, menu, images });

    res.status(201).json({
      status: 'success',
      message: '식당 추가 성공',
      restaurant: newRestaurant,
    });
  };
  getAllRestaurants = async (req, res) => {
    const restaurants = await Restaurant.find();

    res.status(200).json({
      status: 'success',
      message: '모든 식당 조회 성공',
      restaurants,
    });
  };
}

export default RestaurantController;
