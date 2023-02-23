const sessionData = {

  _locale: 'en',
  _modalOpenedCount: 0,

  getLocale: function () {
    return this._locale;
  },

  setLocale: function (locale) {
    this._locale = locale;
  },

  getModalOpenedCount: function () {
    return this._modalOpenedCount;
  },

  someModalIsOpen: function () {
    return this._modalOpenedCount > 0;
  },

  incModalOpenedCount: function () {
    this._modalOpenedCount++;
  },

  decModalOpenedCount: function () {
    this._modalOpenedCount--;
    if (this._modalOpenedCount < 0) {
      this._modalOpenedCount = 0;
    }
  }

};
