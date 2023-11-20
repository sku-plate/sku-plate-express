import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.ObjectId,
      ref: 'Restaurant',
      required: [true, '리뷰에 식당이 필요합니다.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, '리뷰에 유저가 필요합니다.'],
    },
    content: {
      type: String,
      required: [true, '리뷰에 내용이 필요합니다.'],
    },
    rating: {
      type: Number,
      required: [true, '리뷰에 평점이 필요합니다.'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
