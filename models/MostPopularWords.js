const mongoose = require('mongoose');

const MostPopularWordsSchema = new mongoose.Schema({
  words: [String],
});

const MostPopularWords = mongoose.model(
  'MostPopularWords',
  MostPopularWordsSchema
);

module.exports = MostPopularWords;
