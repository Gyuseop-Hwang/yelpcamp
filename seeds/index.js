const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
  .then(() => {
    console.log('Mongo connection succeeded')
  })
  .catch(err => {
    console.log('Mongo connection failed')
    console.log(err)
  })

const sample = arr => arr[Math.floor((Math.random() * arr.length))]



const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const camp = new Campground({
      owner: "63512b45183b73a4a1a58ede",
      location: cities[random1000].city + ', ' + cities[random1000].state,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: 'https://source.unsplash.com/collection/483251',
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum pariatur eaque quisquam a quam iste nihil voluptates natus, dolor suscipit illo illum modi, ipsa nisi. Ipsam ab ducimus similique optio?",
      price: Math.floor(Math.random() * 20),
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});