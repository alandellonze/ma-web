const toast = {

  ok(msg, timeout) {
    this._msg(msg, 'ok', timeout);
  },

  warn(msg, timeout) {
    this._msg(msg, 'warn', timeout);
  },

  ko(msg, timeout) {
    this._msg(msg, 'ko', timeout);
  },

  _msg(msg, style, timeout) {
    this._removeAll();
    const el = this._create(msg, style);
    this._timeout(el, timeout);
  },

  _removeAll() {
    try {
      const list = document.getElementsByClassName('ts');
      for (let i = 0; i < list.length; i++) {
        this._remove(list[i]);
      }
    } catch (e) {
    }
  },

  _create(msg, style) {
    const el = document.createElement('div');
    el.className = 'ts ' + style;
    el.innerHTML = labels.translate(msg);
    document.body.appendChild(el);
    return el;
  },

  _timeout(el, timeout) {
    const t = setTimeout(function () {
      toast._remove(el);
      clearInterval(t);
    }, timeout ? timeout : 3000);
  },

  _remove(el) {
    try {
      document.body.removeChild(el);
    } catch (e) {
    }
  }

};
