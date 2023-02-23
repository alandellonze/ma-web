const util = {

  id: function (id) {
    return document.getElementById(id);
  },

  show: function (id, condition) {
    const el = this.id(id);
    if (el) {
      el.style.display = condition === undefined || condition ? '' : 'none';
    }
  },

  hide: function (id) {
    const el = this.id(id);
    if (el) {
      el.style.display = 'none';
    }
  },

  getValue: function (id) {
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

  setValue: function (id, value) {
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

  emptyTable: function (id) {
    const el = this.id(id);
    if (el) {
      el.innerHTML = '';
    }
    return el;
  },

  tr: function (parent) {
    const el = document.createElement('tr');
    if (parent) {
      parent.appendChild(el);
    }
    return el;
  },

  td: function (content, onclick, parent) {
    const el = document.createElement('td');
    if (content) {
      el.innerHTML = content;
    }
    if (onclick) {
      el.onclick = onclick;
    }
    if (parent) {
      parent.appendChild(el);
    }
    return el;
  },

  _TAG_NAMES: ['A', 'B', 'DIV', 'INPUT', 'LABEL', 'P', 'SPAN', 'TH'],

  allByAttribute: function (attribute) {
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

  createXmlHttpRequest: function () {
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

  disableKeyboardCallback: function (e) {
    e.returnValue = false;
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    return false;
  },

  disableKeyDown: function () {
    if (document.addEventListener) {
      document.addEventListener('keydown', util.disableKeyboardCallback, false);
    } else if (document.attachEvent) {
      document.attachEvent('onkeydown', util.disableKeyboardCallback);
    }
  },

  resetKeyDown: function () {
    if (document.removeEventListener) {
      document.removeEventListener('keydown', util.disableKeyboardCallback);
    } else if (document.detachEvent) {
      document.detachEvent('onkeydown', util.disableKeyboardCallback);
    }
  },

  preventEvent: function (event) {
    if (event) {
      event.returnValue = false;
      if (event.preventDefault)
        event.preventDefault();
    }
  }

};
