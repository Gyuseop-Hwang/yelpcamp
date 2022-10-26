const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
}

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  // const campground = await Campground.findById(id).populate(['reviews', 'owner']);
  const campground = await Campground.findById(id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('owner')
  if (!campground) {
    req.flash('error', 'Cannot find campground')
    res.redirect('/campgrounds')
    return;
  }
  res.render('campgrounds/show', { campground/*, msg : req.flash('success')*/ })
}

module.exports.createCampground = async (req, res, next) => {
  // const { title, location } = req.body.campground;
  // if (!req.body.campground) throw new ExpressError(400, "Invalid Campground Data")
  // if(!req.body.campground.price) throw new ExpressError(400, "Invalid Campground Price Data")
  // if(!req.body.campground.image) throw new ExpressError(400, "Invalid Campground Image Data")
  // mongoose를 아예 시작하기도 전에 error를 잡아버리자. joi로 유효성 검사
  const campground = new Campground(req.body.campground);
  campground.images = req.files.map(file => {
    return { url: file.path, filename: file.filename }
  })
  campground.owner = req.user._id
  await campground.save();
  console.log(campground)
  req.flash('success', "Succesfully made a new campground")
  res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.renderEditForm = async (req, res) => {
  const id = req.params.id
  const campground = await Campground.findById(id)
  if (!campground) {
    req.flash('error', 'Cannot find campground')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', { campground })
}

module.exports.updateCampground = async (req, res) => {
  const id = req.params.id
  const campground = await Campground.findByIdAndUpdate(id, req.body.campground)
  campground.images.push(req.files.map(file => {
    return { url: file.path, filename: file.filename }
  }))
  await campground.save();
  req.flash('success', "Succesfully updated campground")
  res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res) => {
  const id = req.params.id
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds')
}