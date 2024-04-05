const cron = require('node-cron');
const { translateText } = require('./translateText');
const {
  giveWordsUsersForLearn,
  learnedWordsForToday,
} = require('../services/userServices');

const sendingWordsDaily = (bot, chatId, userData) => {
  cron.schedule('00 10 * * *', async () => {
    if (userData.todayLearnWords.length > 1) {
      await learnedWordsForToday(userData.userName);

      await bot.sendMessage(chatId, 'Вто твои слова на сегодня 🤓');

      for (let i = 0; i < userData.todayLearnWords.length; i++) {
        await translateText(bot, chatId, userData.todayLearnWords[i]);
      }

      giveWordsUsersForLearn(userName);
    }
  });
};

module.exports = {
  sendingWordsDaily,
};
