const TelegramApi = require('node-telegram-bot-api');
require('dotenv').config();
const mongoose = require('mongoose');
const {
  startedText,
  continueLearnText,
  emptyArraySavedWords,
} = require('./constants/text/text');
const { startedStickerId } = require('./constants/stickerId/stickerId');
const {
  translateText,
  getExampleToUse,
  getHearHowCall,
} = require('./functions/translateText');
const {
  mainKeyboard,
  translateKeyboard,
  saveWordKeyboard,
  backKeyboard,
  dailyWordsKeyboard,
} = require('./keyboard');
const {
  addNewUser,
  getUser,
  setLanguageTranslateUser,
  setNumberWordsStudyEveryDay,
  addWordToSaveArray,
  removeAllSaveWord,
  removeAllByIndex,
  learnedWordsForToday,
  giveWordsUsersForLearn,
} = require('./services/userServices');
const {
  selectLanguagesOptions,
  learnThousandWordsOptions,
} = require('./options');
const { sendingWordsDaily } = require('./functions/sendingWordsDaily');

mongoose.connect(process.env.MONGO_URL);

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramApi(token, { polling: true });

let translateState = false;
let language = [];

async function start() {
  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const userName = msg.from.username;
    const userData = await getUser(userName);

    if (text === '/start') {
      await bot.sendSticker(chatId, startedStickerId);
      await bot.sendMessage(chatId, startedText, mainKeyboard);

      addNewUser({ userName });
      sendingWordsDaily(bot, chatId, userData);

      //потом нада убрать
      translateState = false;

      return;
    }

    if (text === 'Назад 🔙') {
      translateState = false;
      await bot.sendMessage(chatId, continueLearnText, mainKeyboard);

      return;
    }

    if (text === 'Выучил 🫡') {
      await learnedWordsForToday(userName);
      await bot.sendMessage(
        chatId,
        'Отличный результат 🤩, так держать💪',
        backKeyboard
      );

      return;
    }

    if (text === 'Учить 1000 популярных слов 🎓') {
      if (userData.todayLearnWords.length > 1) {
        await bot.sendMessage(
          chatId,
          'Вто твои слова на сегодня 🤓',
          dailyWordsKeyboard
        );

        for (let i = 0; i < userData.todayLearnWords.length; i++) {
          await translateText(bot, chatId, userData.todayLearnWords[i]);
        }

        return;
      }

      if (!userData.numberWordStudy) {
        await bot.sendMessage(
          chatId,
          'Сколько слов ты хочешь учить в день',
          learnThousandWordsOptions
        );

        return;
      }

      await bot.sendMessage(
        chatId,
        'Вто твои новые на сегодня 🤓',
        dailyWordsKeyboard
      );
      const randomWords = await giveWordsUsersForLearn(userName);

      for (let i = 0; i < randomWords.length; i++) {
        await translateText(bot, chatId, randomWords[i]);
      }

      return;
    }
    if (text === 'Удалить некоторые слова 🗑') {
      await bot.sendMessage(
        chatId,
        'Выберите слова, которые хотите удалить 👇'
      );

      for (let i = 0; i < userData.savedWords.length; i++) {
        const word = userData.savedWords[i];
        await bot.sendMessage(
          chatId,
          `
            ${i + 1}. ${word}
            `,

          {
            reply_markup: {
              inline_keyboard: [
                [{ text: 'Удалить 🗑', callback_data: `remove_${i}` }],
              ],
            },
          }
        );
      }

      return;
    }

    if (text === 'Удалить все слова 🗑') {
      await removeAllSaveWord(userName);
      await bot.sendMessage(
        chatId,
        'У вас больше нет сохраненных слов 📄',
        backKeyboard
      );

      return;
    }

    if (text === 'Сохраненные слова 💾') {
      if (!userData.savedWords || userData.savedWords.length === 0) {
        return bot.sendMessage(chatId, emptyArraySavedWords);
      }

      await bot.sendMessage(chatId, 'Ваши сохраненные слова для повтора 📚');

      for (let i = 0; i < userData.savedWords.length; i++) {
        const word = userData.savedWords[i];
        await bot.sendMessage(
          chatId,
          `
            ${i + 1}. ${word}
            `,

          i === userData.savedWords.length - 1 ? saveWordKeyboard : undefined
        );
      }

      return;
    }

    if (text === 'Изменить язык перевода 🔁') {
      return await bot.sendMessage(
        chatId,
        'Перевести з:',
        selectLanguagesOptions
      );
    }

    if (translateState) {
      translateText(bot, chatId, text, userData);
      translateState = false;
      return;
    }

    if (text === 'Перевести текст 🔎') {
      if (!userData.fromWhichLanguage || !userData.toWhichLanguage) {
        return await bot.sendMessage(
          chatId,
          'Перевести з:',
          selectLanguagesOptions
        );
      }
      await bot.sendMessage(
        chatId,
        `Введите ${userData.fromWhichLanguage} текст для перевода на ${userData.toWhichLanguage}🔤`,
        {
          reply_markup: translateKeyboard,
        }
      );
      translateState = true;

      return;
    }

    if (text) {
      translateText(bot, chatId, text, userData);

      return;
    }
  });

  bot.on('callback_query', async (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;
    const text = query.message.text;
    const userName = query.from.username;
    const userData = await getUser(userName);

    if (data === 'translate_again') {
      translateState = true;
      await bot.sendMessage(
        chatId,
        `Введите ${userData.fromWhichLanguage} текст для перевода на ${userData.toWhichLanguage}🔤`
      );
    }

    if (data === 'examples_using') {
      await getExampleToUse(
        bot,
        chatId,
        query.message.text.split(' -')[0],
        userData
      );
    }

    if (data === 'hear_how_call') {
      await getHearHowCall(
        bot,
        chatId,
        query.message.text.split(' -')[0],
        userData
      );
    }

    if (
      data === 'russian' ||
      data === 'ukrainian' ||
      data === 'polish' ||
      data === 'german' ||
      data === 'spanish' ||
      data === 'french' ||
      data === 'english'
    ) {
      language.push(data);

      if (text === 'Перевести на:') {
        await setLanguageTranslateUser(userName, language);

        await bot.sendMessage(
          chatId,
          `Введите ${language[0]} текст для перевода на ${language[1]}🔤`
        );

        language.length = 0;
        translateState = true;

        return;
      }

      await bot.sendMessage(chatId, 'Перевести на:', selectLanguagesOptions);
    }

    if (
      data === 'three_words' ||
      data === 'five_words' ||
      data === 'ten_words'
    ) {
      const response = await setNumberWordsStudyEveryDay(userName, data);

      await bot.sendMessage(
        chatId,
        `
Хорошо я буду посылать вам ${response.numberWordStudy} слов для вас каждый день 👌 
Надеюсь это поможет вам лучше выучить язык 😃
`
      );

      await bot.sendMessage(
        chatId,
        'Вто твои слова на сегодня 🤓',
        dailyWordsKeyboard
      );
      const randomWords = await giveWordsUsersForLearn(userName);

      for (let i = 0; i < randomWords.length; i++) {
        await translateText(bot, chatId, randomWords[i]);
      }

      return;
    }

    if (data === 'save_word') {
      await bot.sendMessage(
        chatId,
        await addWordToSaveArray(userName, text, translateKeyboard)
      );
    }

    if (data.split('_')[0] === 'remove') {
      const newSavedWords = await removeAllByIndex(
        userName,
        data.split('_')[1]
      );

      if (newSavedWords.length === 0) {
        await bot.sendMessage(chatId, emptyArraySavedWords, backKeyboard);

        return;
      }

      await bot.sendMessage(
        chatId,
        'Выберите слова, которые хотите удалить 👇'
      );

      for (let i = 0; i < newSavedWords.length; i++) {
        const word = newSavedWords[i];
        await bot.sendMessage(
          chatId,
          `
            ${i + 1}. ${word}
            `,

          {
            reply_markup: {
              inline_keyboard: [
                [{ text: 'Удалить 🗑', callback_data: `remove_${i}` }],
              ],
            },
          }
        );
      }

      return;
    }
  });
}

start();
