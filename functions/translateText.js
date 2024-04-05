const Reverso = require('reverso-api');
const {
  translateAgainTextOptions,
  translateTextOptions,
} = require('../options');

const reverso = new Reverso();

const translateText = async (bot, chatId, text, userData) => {
  try {
    if (Number(text)) {
      throw new Error();
    }

    let fromWhichLanguage = 'english';
    let toWhichLanguage = 'russian';

    if (userData) {
      fromWhichLanguage = userData.fromWhichLanguage;
      toWhichLanguage = userData.toWhichLanguage;
    }

    if (fromWhichLanguage === 'ukrainian') {
      fromWhichLanguage = 'russian';

      const translationResult = await reverso.getTranslation(
        text,
        fromWhichLanguage,
        toWhichLanguage
      );

      text = translationResult.translations[0];
    }

    const translation = await reverso.getTranslation(
      text,
      fromWhichLanguage,
      toWhichLanguage
    );

    bot.sendMessage(
      chatId,
      `${text} - ${translation.translations.join(', ')}`,
      translateTextOptions
    );
  } catch (e) {
    console.log(e);
    bot.sendMessage(chatId, 'Невалидный текст', translateAgainTextOptions);
  }
};

const getExampleToUse = async (bot, chatId, text, userData) => {
  try {
    let { fromWhichLanguage, toWhichLanguage } = userData;

    if (fromWhichLanguage === 'ukrainian') {
      fromWhichLanguage = 'russian';
    }
    if (toWhichLanguage === 'ukrainian') {
      toWhichLanguage = 'russian';
    }

    const translationResult = await reverso.getTranslation(
      text,
      fromWhichLanguage,
      toWhichLanguage
    );
    text = translationResult.translations[0];

    const context = await reverso.getContext(
      text,
      fromWhichLanguage,
      toWhichLanguage
    );

    if (context) {
      await bot.sendMessage(
        chatId,
        `🖊 Вот несколько примеров использования - <b>${text}</b>`,
        { parse_mode: 'HTML' }
      );

      const examples = context.examples.slice(0, 4);

      for (let i = 0; i < examples.length; i++) {
        await bot.sendMessage(
          chatId,
          `- ${examples[i].source}
- ${examples[i].target}
          `,
          i + 1 === examples.length ? translateAgainTextOptions : {}
        );
      }
    }
  } catch (e) {
    bot.sendMessage(chatId, 'Невалидный текст', translateAgainTextOptions);
  }
};

const getHearHowCall = async (bot, chatId, text, userData) => {
  try {
    let { fromWhichLanguage, toWhichLanguage } = userData;

    if (fromWhichLanguage === 'ukrainian') {
      fromWhichLanguage = 'russian';
    }
    if (toWhichLanguage === 'ukrainian') {
      toWhichLanguage = 'russian';
    }

    const translationResult = await reverso.getTranslation(
      text,
      fromWhichLanguage,
      toWhichLanguage
    );

    text = translationResult.translations[0];

    const translation = await reverso.getTranslation(
      text,
      fromWhichLanguage,
      toWhichLanguage
    );

    if (translation.voice) {
      bot.sendAudio(chatId, translation.voice, translateAgainTextOptions);
    }
  } catch (e) {}
};

module.exports = {
  translateText,
  getExampleToUse,
  getHearHowCall,
};
