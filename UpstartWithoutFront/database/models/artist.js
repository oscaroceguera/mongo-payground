const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
  title: String,
  date: Date,
  copiesSold: Number,
  numberTracks: Number,
  image: String,
  renueve: Number
});

module.exports = AlbumSchema;