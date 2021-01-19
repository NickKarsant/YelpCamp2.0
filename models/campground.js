var mongoose = require("mongoose");
const Review = require('./review');
const Schema = mongoose.Schema;

// SCHEMA SETUP
const campgroundSchema = new Schema({
  title: String,
  price: Number,
  image: String,
  location: String,
  description: String,
  author: {
    id: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
});

campgroundSchema.post('findOneAndDelete', async (doc) => {
  console.log(doc.reviews);
  if (doc) {
    await Review.remove({
      _id: {$in: doc.reviews}
    })
  }
});

module.exports = mongoose.model("campground", campgroundSchema);





