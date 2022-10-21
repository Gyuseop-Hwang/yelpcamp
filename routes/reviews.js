const express = require('express');

const Campground = require('../models/campground');
const Review = require('../models/review')
const { validateReview, isLoggedIn, isAuthor } = require('../middleware');
// app.get('/makecampground', async (req, res) => {
//   const camp = new Campground({ title: 'My Backyard' })
//   await camp.save();
//   res.json(camp);
// })

const wrapAsync = require('../utils/wrapAsync');
const router = express.Router({ mergeParams: true });

router.post('/', isLoggedIn, validateReview, wrapAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review)
  review.author = req.user._id;
  campground.reviews.push(review)
  await Promise.allSettled([review.save(), campground.save()]);
  req.flash('success', 'Created new review')
  res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId)
  req.flash('success', 'Deleted review')
  res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;