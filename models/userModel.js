import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '이름을 입력해주세요.'],
    },
    profileImage: {
      type: String,
      default: 'default.jpg',
    },
    email: {
      type: String,
      unique: true,
    },
    bookmarkedRestaurants: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
      },
    ],
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('bookmarks', {
  ref: 'Restaurant',
  foreignField: '_id',
  localField: 'bookmarkedRestaurants',
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
