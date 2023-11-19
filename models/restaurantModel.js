import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '이름을 입력해주세요.'],
  },
  location: {
    address: String,
    coordinates: [Number],
  },
  menu: [
    {
      name: String,
      price: Number,
    },
  ],
  images: [String],
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
