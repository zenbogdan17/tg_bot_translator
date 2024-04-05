const translateAgainTextOptions = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'Перевести ещё 🔄', callback_data: 'translate_again' }],
    ],
  },
};

const translateTextOptions = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'Примеры использования 📝', callback_data: 'examples_using' }],
      [{ text: 'Прослушать 🔊 ', callback_data: 'hear_how_call' }],
      [{ text: 'Сохранить 💾 ', callback_data: 'save_word' }],
      [{ text: 'Перевести ещё что-то 🔄', callback_data: 'translate_again' }],
    ],
  },
};

const selectLanguagesOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'russian', callback_data: 'russian' },
        { text: 'ukrainian', callback_data: 'ukrainian' },
        { text: 'polish', callback_data: 'polish' },
      ],
      [
        { text: 'german', callback_data: 'german' },
        { text: 'spanish', callback_data: 'spanish' },
        { text: 'french', callback_data: 'french' },
      ],
      [{ text: 'english', callback_data: 'english' }],
    ],
  },
};

const learnThousandWordsOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '3️⃣', callback_data: 'three_words' },
        { text: '5️⃣', callback_data: 'five_words' },
        { text: '🔟', callback_data: 'ten_words' },
      ],
    ],
  },
};

module.exports = {
  translateAgainTextOptions,
  translateTextOptions,
  selectLanguagesOptions,
  learnThousandWordsOptions,
};
