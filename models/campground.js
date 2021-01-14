var mongoose = require("mongoose");
const Schema = mongoose.Schema;

// SCHEMA SETUP
var campgroundSchema = new Schema({
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

module.exports = mongoose.model("campground", campgroundSchema);
