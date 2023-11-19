import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, '이름을 입력해주세요.'],
  },
  typeOfFood: {
    type: String,
    required: [true, '음식 종류를 입력해주세요.'],
  },
  address: {
    type: String,
    required: [true, '주소를 입력해주세요.'],
  },
  menu: [
    {
      name: String,
      price: Number,
    },
  ],
  images: [String],
  tags: [String],
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

restaurantSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'restaurant',
  localField: '_id',
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
