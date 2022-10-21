const express = require('express');
const Campground = require('../models/campground');
const { isLoggedIn, isOwner, validateCampground } = require('../middleware');
const wrapAsync = require('../utils/wrapAsync');

const router = express.Router();

router.get('/', wrapAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds })
}))

router.get('/new', isLoggedIn, (req, res) => {

  res.render('campgrounds/new');
})

router.get('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  // const campground = await Campground.findById(id).populate(['reviews', 'owner']);
  const campground = await Campground.findById(id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('owner')
  console.log(campground)
  if (!campground) {
    req.flash('error', 'Cannot find campground')
    res.redirect('/campgrounds')
    return;
  }
  res.render('campgrounds/show', { campground/*, msg : req.flash('success')*/ })
}))


// req.body = {  campground : {} }
// campground {
//   title : asdasfas,
//   price : 12,
//   ...
// }

router.post('/', isLoggedIn, validateCampground, wrapAsync(async (req, res, next) => {
  // const { title, location } = req.body.campground;
  // if (!req.body.campground) throw new ExpressError(400, "Invalid Campground Data")
  // if(!req.body.campground.price) throw new ExpressError(400, "Invalid Campground Price Data")
  // if(!req.body.campground.image) throw new ExpressError(400, "Invalid Campground Image Data")
  // mongoose를 아예 시작하기도 전에 error를 잡아버리자. joi로 유효성 검사

  const campground = new Campground(req.body.campground);
  campground.owner = req.user._id
  await campground.save();
  req.flash('success', "Succesfully made a new campground")
  res.redirect(`/campgrounds/${campground._id}`)

}))

router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  const id = req.params.id
  const campground = await Campground.findById(id)
  if (!campground) {
    req.flash('error', 'Cannot find campground')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', { campground })
}))

router.put('/:id', isLoggedIn, isOwner, validateCampground, wrapAsync(async (req, res) => {
  const id = req.params.id
  await Campground.findByIdAndUpdate(id, req.body.campground)
  req.flash('success', "Succesfully updated campground")
  res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  const id = req.params.id
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds')
}))

module.exports = router;