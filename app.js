
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');

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

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));



app.get('/', (req, res) => {
  res.render('home')
})

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds })
})

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
})

app.get('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/show', { campground })
})

app.post('/campgrounds', async (req, res) => {
  const { title, location } = req.body.campground;
  const campground = new Campground({ title, location });
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/edit', { campground })
})

app.put('/campgrounds/:id', async (req, res) => {
  const id = req.params.id
  await Campground.findByIdAndUpdate(id, req.body.campground)
  res.redirect(`/campgrounds/${id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect('/campgrounds')
})

// app.get('/makecampground', async (req, res) => {
//   const camp = new Campground({ title: 'My Backyard' })
//   await camp.save();
//   res.json(camp);
// })

app.listen(3000, () => {
  console.log('listening on port 3000')
})