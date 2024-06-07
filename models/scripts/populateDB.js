const mongoose = require('mongoose');
const Beach = require('../beach');
const axios = require('axios')
const dotenv = require('dotenv').config();
const mongoString = process.env.DB_MONGO;


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

mongoose.connect(mongoString)
  .then(async () => {
      console.log('MongoDB connected');
      await Beach.deleteMany({});
      await Beach.insertMany(beaches);
      console.log('Database populated with example beaches');
      mongoose.connection.close();
  })
  .catch(err => {
      console.error('MongoDB connection error:', err);
  });