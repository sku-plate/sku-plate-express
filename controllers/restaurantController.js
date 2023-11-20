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

  getRestaurant = async (req, res) => {
    const { restaurantId } = req.params;

    try {
      const restaurant = await Restaurant.findById({ _id: restaurantId });
      console.log(restaurant);
      res.status(200).json({
        status: 'success',
        message: '식당 조회 성공',
        restaurant,
      });
    } catch {
      res.status(500).json({
        status: 'fail',
        message: '식당 조회 실패',
      });
    }
  };

  getAllRestaurants = async (req, res) => {
    const restaurants = await Restaurant.find();

    console.log('getAllRestaurants');

    res.header('Access-Control-Allow-Origin', '*');

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

      console.log('getOneTypeOfFoodRestaurants');

      res.status(200).json({
        status: 'success',
        message: '특정분야 식당 조회 성공',
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

  getBookmarkedRestaurants = async (req, res) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(404).json({
          status: 'fail',
          message: '유저를 찾을 수 없습니다.',
        });
      }

      console.log('getBookmarkedRestaurants');

      const bookmarkedRestaurants = await Restaurant.find({ _id: { $in: user.bookmarkedRestaurants } });

      res.status(200).json({
        status: 'success',
        message: '북마크한 식당 조회 성공',
        length: bookmarkedRestaurants.length,
        bookmarkedRestaurants,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: '서버 에러 발생',
        error: error.message,
      });
    }
  };

  bookmarkRestaurant = async (req, res) => {
    try {
      const { restaurantId } = req.params;
      const restaurant = await Restaurant.findById(restaurantId);
      const user = req.user;

      console.log({ restaurant, user });

      if (!restaurant || !user) {
        return res.status(404).json({
          status: 'fail',
          message: '식당 또는 유저를 찾을 수 없습니다.',
        });
      }

      if (user.bookmarkedRestaurants.includes(restaurantId)) {
        user.bookmarkedRestaurants.pull(restaurantId);
        await user.save();

        res.status(200).json({
          status: 'success',
          message: '식당 북마크 제거 성공',
        });
      } else {
        user.bookmarkedRestaurants.push(restaurantId);
        await user.save();

        res.status(200).json({
          status: 'success',
          message: '식당 북마크 추가 성공',
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: '서버 에러 발생',
        error: error.message,
      });
    }
  };
}

export default RestaurantController;
