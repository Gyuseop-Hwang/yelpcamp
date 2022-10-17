const mongoose = require('mongoose');
const { stringify } = require('qs');

const Schema = mongoose.Schema;


const CampgroundSchema = new Schema({
  title: String,
  price: String,
  description: String,
  location: String,
})

module.exports = mongoose.model('Campground', CampgroundSchema);