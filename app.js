
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi')
const { campgroundSchema } = require('./schemas')

mongoose.connect('mongodb://localhost:27017/yelp-camp')
  .then(() => {
    console.log('Mongo connection succeeded')
  })
  .catch(err => {
    console.log('Mongo connection failed')
    console.log(err)
  })

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

const wrapAsync = require('./utils/wrapAsync');

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/campgrounds', wrapAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds })
}))

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
})

app.get('/campgrounds/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/show', { campground })
}))


// req.body = {  campground : {} }
// campground {
//   title : asdasfas,
//   price : 12,
//   ...
// }

const validateCampground = (req, res, next) => {

  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const message = error.details.map(el => el.message).join(",")
    throw new ExpressError(400, message)
  } else {
    next()
  }
}

app.post('/campgrounds', validateCampground, wrapAsync(async (req, res, next) => {
  // const { title, location } = req.body.campground;
  // if (!req.body.campground) throw new ExpressError(400, "Invalid Campground Data")
  // if(!req.body.campground.price) throw new ExpressError(400, "Invalid Campground Price Data")
  // if(!req.body.campground.image) throw new ExpressError(400, "Invalid Campground Image Data")
  // mongoose를 아예 시작하기도 전에 error를 잡아버리자. joi로 유효성 검사

  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`)

}))

app.get('/campgrounds/:id/edit', wrapAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/edit', { campground })
}))

app.put('/campgrounds/:id', validateCampground, wrapAsync(async (req, res) => {
  const id = req.params.id
  await Campground.findByIdAndUpdate(id, req.body.campground)
  res.redirect(`/campgrounds/${id}`)
}))

app.delete('/campgrounds/:id', wrapAsync(async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect('/campgrounds')
}))

// app.get('/makecampground', async (req, res) => {
//   const camp = new Campground({ title: 'My Backyard' })
//   await camp.save();
//   res.json(camp);
// })

app.all('*', (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"))
})

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = 'Server Problem';
  res.status(status).render('error', { err })
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})