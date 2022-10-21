const Campground = require('./models/campground')
const Review = require('./models/review')
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas')

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // console.log(req.path, req.originalUrl)
    req.session.returnTo = req.originalUrl;
    req.session.save(err => {
      if (err) next(err);
      req.flash('error', 'you must be signed')
      res.redirect('/login')
    })
    // store the url they are requesting
    return;
  }
  next()
}

module.exports.isOwner = async (req, res, next) => {
  const id = req.params.id
  const campground = await Campground.findById(id);
  if (!campground.owner.equals(req.user._id)) {
    req.flash('error', "You don't have a permission")
    return res.redirect(`/campgrounds/${id}`)
  }
  next();
}

module.exports.isAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash('error', "You don't have a permission")
    return res.redirect(`/campgrounds/${id}`)
  }
  next();
}

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const message = error.details.map(el => el.message).join(",")
    throw new ExpressError(400, message)
  } else {
    next()
  }
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message);
    throw new ExpressError(400, msg);
  } else {
    next()
  }
}