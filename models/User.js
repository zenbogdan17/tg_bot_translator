const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  userName: String,
  fromWhichLanguage: String,
  toWhichLanguage: String,
  savedWords: [String],
  numberWordStudy: Number,
  learnedWords: [String],
  todayLearnWords: [String],
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
