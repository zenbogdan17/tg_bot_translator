const MostPopularWords = require('../models/MostPopularWords');
const User = require('../models/User');

const addNewUser = async (userData) => {
  try {
    const existingUser = await User.findOne({ userName: userData.userName });

    //защита от перерегистрации
    if (existingUser) return;

    const newUser = new User(userData);
    await newUser.save();
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
  }
};

const getUser = async (userName) => {
  try {
    const userData = await User.findOne({ userName });

    return userData;
  } catch (error) {
    console.log(error);
  }
};

const setLanguageTranslateUser = async (userName, languageArr) => {
  try {
    const userData = await User.findOne({ userName });

    userData.fromWhichLanguage = languageArr[0];
    userData.toWhichLanguage = languageArr[1];

    await userData.save();
  } catch (error) {
    console.log(error);
  }
};

const setNumberWordsStudyEveryDay = async (userName, number) => {
  try {
    const userData = await User.findOne({ userName });

    const numberMapping = {
      three_words: 3,
      five_words: 5,
      ten_words: 10,
    };

    if (number in numberMapping) {
      number = numberMapping[number];
    }

    userData.numberWordStudy = number;

    await userData.save();

    return userData;
  } catch (error) {
    console.log(error);
  }
};

const addWordToSaveArray = async (userName, text) => {
  try {
    const userData = await User.findOne({ userName });

    if (!userData.savedWords.includes(text)) {
      userData.savedWords.push(text);
      await userData.save();

      return 'Сохранено 💾';
    } else {
      return `Слово "${text.split(' -')[0]}" уже было сохранено раньше 😯`;
    }
  } catch (error) {
    console.log(error);
  }
};

const removeAllSaveWord = async (userName) => {
  try {
    const userData = await User.findOne({ userName });

    userData.savedWords = [];

    await userData.save();
  } catch (error) {
    console.log(error);
  }
};

const removeAllByIndex = async (userName, index) => {
  try {
    const userData = await User.findOne({ userName });

    userData.savedWords.splice(index, 1);

    await userData.save();

    return userData.savedWords;
  } catch (error) {
    console.log(error);
  }
};

const giveWordsUsersForLearn = async (userName) => {
  try {
    const user = await User.findOne({ userName });
    const mostPopularWords = await MostPopularWords.find();
    const wordsArray = mostPopularWords[0].words;

    const filteredArray = wordsArray.filter(
      (element) => !user.learnedWords.includes(element)
    );

    const randomWords = [];

    for (let i = 0; i < user.numberWordStudy; i++) {
      const randomIndex = Math.floor(Math.random() * filteredArray.length);
      randomWords.push(filteredArray[randomIndex]);
      filteredArray.splice(randomIndex, 1);
    }

    user.todayLearnWords = randomWords;
    await user.save();

    return randomWords;
  } catch (error) {
    console.log(error);
  }
};

const learnedWordsForToday = async (userName) => {
  try {
    const userData = await User.findOne({ userName });

    userData.learnedWords = userData.learnedWords.concat(
      userData.todayLearnWords
    );

    userData.todayLearnWords = [];

    await userData.save();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addNewUser,
  getUser,
  setLanguageTranslateUser,
  setNumberWordsStudyEveryDay,
  addWordToSaveArray,
  removeAllSaveWord,
  removeAllByIndex,
  giveWordsUsersForLearn,
  learnedWordsForToday,
};
