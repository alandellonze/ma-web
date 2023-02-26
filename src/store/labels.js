const labels = {

  _values: undefined,

  init() {
    this._values = labelsStore.get(sessionData.getLocale());
  },

  translateLabelsInPage() {
    const elements = util.allByAttribute('data-label');
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];

      // translate data-label
      const translation = this.translate(el.getAttribute('data-label'));

      // fill html element with the translated value
      if (el.tagName === 'INPUT') {
        el.value = translation;
      } else {
        el.innerHTML = translation;
      }
    }
  },

  translate(text) {
    let translation = '';

    const texts = text.split(' ');
    for (let j = 0; j < texts.length; j++) {
      const t = texts[j];
      translation += (this._values[t] === undefined ? t : this._values[t]) + ' ';
    }

    return translation.trim();
  }

};
