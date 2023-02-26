const sessionData = {

  _locale: 'en',
  _modalOpenedCount: 0,

  getLocale() {
    return this._locale;
  },

  setLocale(locale) {
    this._locale = locale;
  },

  getModalOpenedCount() {
    return this._modalOpenedCount;
  },

  someModalIsOpen() {
    return this._modalOpenedCount > 0;
  },

  incModalOpenedCount() {
    this._modalOpenedCount++;
  },

  decModalOpenedCount() {
    this._modalOpenedCount--;
    if (this._modalOpenedCount < 0) {
      this._modalOpenedCount = 0;
    }
  }

};
