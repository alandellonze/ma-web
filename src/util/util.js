const util = {

  id(id) {
    return document.getElementById(id);
  },

  show(id, condition) {
    const el = this.id(id);
    if (el) {
      el.style.display = condition === undefined || condition ? '' : 'none';
    }
  },

  hide(id) {
    const el = this.id(id);
    if (el) {
      el.style.display = 'none';
    }
  },

  getValue(id) {
    const el = this.id(id);
    if (el) {
      if (el.tagName === 'INPUT') {
        if (el.type === 'checkbox') {
          return el.checked;
        } else {
          return el.value;
        }
      } else if (el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
        return el.value;
      } else {
        return el.innerHTML;
      }
    }
  },

  setValue(id, value) {
    const el = this.id(id);
    if (el) {
      if (value === null || value === undefined) {
        value = '';
      }

      if (el.tagName === 'INPUT') {
        if (el.type === 'checkbox') {
          el.checked = value;
        } else {
          el.value = value;
        }
      } else if (el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
        el.value = value;
      } else {
        el.innerHTML = value;
      }
    }
  },

  emptyTable(id) {
    const el = this.id(id);
    if (el) {
      el.innerHTML = '';
    }
    return el;
  },

  div(parent, content, className, onclick) {
    return this._el('div', parent, content, className, onclick);
  },

  table(parent, className, onclick) {
    return this._el('table', parent, null, className, onclick);
  },

  tr(parent, className, onclick) {
    return this._el('tr', parent, null, className, onclick);
  },

  td(parent, content, className, onclick, colSpan, id) {
    const el = this._el('td', parent, content, className, onclick);
    if (colSpan) {
      el.colSpan = colSpan;
    }
    if (id) {
      el.id = id;
    }
    return el;
  },

  text(parent, value, className, onclick) {
    const el = this._el('input', parent, null, className, onclick);
    el.type = 'text';
    if (value) {
      el.value = value;
    }
    return el;
  },

  button(parent, label, className, onclick) {
    return this._el('button', parent, label, className, onclick);
  },

  select(parent, values, value, className, onclick) {
    const el = this._el('select', parent, null, className, onclick);
    if (values) {
      this._options(el, values);
    }
    if (value) {
      el.value = value;
    }
    return el;
  },

  _options(select, values) {
    Object.keys(values).forEach(function (value) {
      const key = values[value];
      select.appendChild(util._option(key, value));
    });
  },

  _option(key, value) {
    const option = document.createElement('option');
    option.value = key;
    option.appendChild(document.createTextNode('(' + key + ') ' + labels.translate(value)));
    return option;
  },

  _el(tagName, parent, content, className, onclick) {
    const el = document.createElement(tagName);
    if (parent) {
      parent.appendChild(el);
    }
    if (content) {
      if (content.appendChild) {
        el.appendChild(content);
      } else {
        el.innerHTML = content;
      }
    }
    if (className) {
      el.className = className;
    }
    if (onclick) {
      el.onclick = onclick;
    }
    return el;
  },


  _TAG_NAMES: ['A', 'B', 'DIV', 'INPUT', 'LABEL', 'P', 'SPAN', 'TH'],

  allByAttribute(attribute) {
    const els = [];
    for (let t = 0; t < util._TAG_NAMES.length; t++) {
      const allEls = document.getElementsByTagName(util._TAG_NAMES[t]);
      for (let i = 0; i < allEls.length; i++) {
        if (allEls[i].getAttribute(attribute) !== null) {
          els.push(allEls[i]);
        }
      }
    }
    return els;
  },

  int2(i) {
    return ('0' + i).slice(-2);
  },

  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  },

  addClass: function (id, className) {
    const e = this.id(id);
    if (e) {
      e.classList.add(className);
    }
  },

  removeClass: function (id, className) {
    const e = this.id(id);
    if (e) {
      e.classList.remove(className);
    }
  },

  createXmlHttpRequest() {
    if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    }

    try {
      return new ActiveXObject('Microsoft.XMLHTTP');
    } catch (e) {
      try {
        return new ActiveXObject('Msxml2.XMLHTTP');
      } catch (e) {
      }
    }
  },

  disableKeyboardCallback(e) {
    e.returnValue = false;
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    return false;
  },

  disableKeyDown() {
    if (document.addEventListener) {
      document.addEventListener('keydown', util.disableKeyboardCallback, false);
    } else if (document.attachEvent) {
      document.attachEvent('onkeydown', util.disableKeyboardCallback);
    }
  },

  resetKeyDown() {
    if (document.removeEventListener) {
      document.removeEventListener('keydown', util.disableKeyboardCallback);
    } else if (document.detachEvent) {
      document.detachEvent('onkeydown', util.disableKeyboardCallback);
    }
  },

  preventEvent(event) {
    if (event) {
      event.returnValue = false;
      if (event.preventDefault)
        event.preventDefault();
    }
  }

};
