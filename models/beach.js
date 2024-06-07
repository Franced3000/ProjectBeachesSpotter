const mongoose = require('mongoose');

const beachSchema = new mongoose.Schema({
  name: String,
  location: String,
  bandiera_blu: Boolean,
  latitude: Number,
  longitude: Number
});

const Beach = mongoose.model('Beach', beachSchema);


const beaches = [
    {
      name: "Spiaggia dei Conigli",
      location: "Lampedusa",
      bandiera_blu: true,
      latitude: 35.4972,
      longitude: 12.5356
    },
    {
      name: "San Vito lo Capo",
      location: "San Vito lo Capo",
      bandiera_blu: true,
      latitude: 38.1759,
      longitude: 12.7347
    }
];

module.exports =  Beach;
