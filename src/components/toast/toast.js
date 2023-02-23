const toast = {

  ok: function (msg, timeout) {
    this._msg(msg, 'ok', timeout);
  },

  warn: function (msg, timeout) {
    this._msg(msg, 'warn', timeout);
  },

  ko: function (msg, timeout) {
    this._msg(msg, 'ko', timeout);
  },

  _msg: function (msg, style, timeout) {
    this._removeAll();
    const el = this._create(msg, style);
    this._timeout(el, timeout);
  },

  _removeAll: function () {
    try {
      const list = document.getElementsByClassName('ts');
      for (let i = 0; i < list.length; i++) {
        this._remove(list[i]);
      }
    } catch (e) {
    }
  },

  _create: function (msg, style) {
    const el = document.createElement('div');
    el.className = 'ts ' + style;
    el.innerHTML = labels.translate(msg);
    document.body.appendChild(el);
    return el;
  },

  _timeout: function (el, timeout) {
    const t = setTimeout(function () {
      toast._remove(el);
      clearInterval(t);
    }, timeout ? timeout : 3000);
  },

  _remove: function (el) {
    try {
      document.body.removeChild(el);
    } catch (e) {
    }
  }

};
