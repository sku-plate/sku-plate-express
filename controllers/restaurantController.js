import dotenv from 'dotenv';
import Restaurant from '../models/restaurantModel.js';

dotenv.config({ path: './config.env' });

class RestaurantController {
  addRestaurant = async (req, res) => {
    try {
      const { name, address, typeOfFood, menu, images } = req.body;

      const newRestaurant = await Restaurant.create({ name, address, typeOfFood, menu, images });
      console.log(newRestaurant);
      res.status(201).json({
        status: 'success',
        message: '식당 추가 성공',
        restaurant: newRestaurant,
      });
    } catch {
      res.status(500).json({
        status: 'fail',
        message: '식당 추가 실패',
      });
    }
  };

  getAllRestaurants = async (req, res) => {
    const restaurants = await Restaurant.find();

    res.status(200).json({
      status: 'success',
      message: '모든 식당 조회 성공',
      length: restaurants.length,
      restaurants,
    });
  };

  getOneTypeOfFoodRestaurants = async (req, res) => {
    const { typeOfFood } = req.params;

    try {
      const restaurants = await Restaurant.find({ typeOfFood });

      res.status(200).json({
        status: 'success',
        message: '모든 식당 조회 성공',
        length: restaurants.length,
        restaurants,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  };

  searchRestaurant = async (req, res) => {
    const { searchKeyword } = req.params;

    try {
      const [resultByName, resultByTags] = await Promise.all([
        Restaurant.find({ name: { $regex: searchKeyword, $options: 'i' } }),
        Restaurant.find({ tags: { $regex: searchKeyword, $options: 'i' } }),
      ]);

      const resultSet = new Set();
      resultByName.forEach((item) => resultSet.add(item.name));
      resultByTags.forEach((item) => resultSet.add(item.name));
      const result = Array.from(resultSet).map((name) => {
        const foundResult = [...resultByName, ...resultByTags].find((item) => item.name === name);
        return foundResult;
      });

      res.status(200).json({
        status: 'success',
        message: '모든 식당 조회 성공',
        length: result.length,
        result,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  };
}

export default RestaurantController;
