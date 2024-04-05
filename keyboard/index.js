const mainKeyboard = {
  reply_markup: {
    keyboard: [
      ['Перевести текст 🔎'],
      ['Учить 1000 популярных слов 🎓'],
      ['Сохраненные слова 💾'],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  },
};

const translateKeyboard = {
  keyboard: [
    ['Перевести текст 🔎'],
    ['Изменить язык перевода 🔁'],
    ['Назад 🔙'],
  ],
  resize_keyboard: true,
  one_time_keyboard: true,
};

const saveWordKeyboard = {
  reply_markup: {
    keyboard: [
      ['Удалить некоторые слова 🗑'],
      ['Удалить все слова 🗑'],
      ['Назад 🔙'],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  },
};

const backKeyboard = {
  reply_markup: {
    keyboard: [['Назад 🔙']],
    resize_keyboard: true,
    one_time_keyboard: true,
  },
};

const dailyWordsKeyboard = {
  reply_markup: {
    keyboard: [['Выучил 🫡'], ['Назад 🔙']],
    resize_keyboard: true,
    one_time_keyboard: true,
  },
};

module.exports = {
  mainKeyboard,
  translateKeyboard,
  saveWordKeyboard,
  backKeyboard,
  dailyWordsKeyboard,
};
