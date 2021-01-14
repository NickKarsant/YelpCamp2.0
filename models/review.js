var mongoose = require('mongoose')

var reviewSchema = new mongoose.Schema({
  body: String,
  rating: Number
});

module.exports = mongoose.model("Review", reviewSchema);