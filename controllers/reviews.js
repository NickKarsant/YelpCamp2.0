const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.create = async (req, res) => {
  try{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
  } catch(err){
    next(err)
  } 
}


module.exports.delete = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    console.log(review[rating]);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
  } catch(err){
    next(err)
  }  
}