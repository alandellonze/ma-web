function Modal(handler, page) {
  this.handler = handler;
  this.page = page;
}

Modal.prototype = {

  handler: undefined,
  page: undefined,

  modalEl: undefined,
  mouseListener: undefined,
  keyListener: undefined,

  _generateModal: function () {
    // generate the modal
    const modalId = ('' + Math.random()).replace('.', '');
    this.modalEl = util.div(document.body, this._generateModalContent(), 'modal-el', null, modalId);

    // translate the labels
    labels.translateLabelsInPage();

    // add listener to hide the modal by clicking outside or by hitting escape
    this.mouseListener = this._generateMouseListener();
    this.keyListener = this._generateKeyListener();
    document.addEventListener('mousedown', this.mouseListener);
    document.addEventListener('keyup', this.keyListener);
  },

  _generateModalContent: function () {
    const div = util.div(null, null, 'modal-content');
    div.appendChild(this._generateModalHeader());
    div.appendChild(this._generateModalBody());
    div.appendChild(this._generateModalFooter());
    return div;
  },

  _generateModalHeader: function () {
    const title = this.handler.title ? labels.translate(this.handler.title) : '';
    return util.div(null, title, 'modal-header', null, 'modal-header-span');
  },

  _generateModalBody: function () {
    const body = util.div(null, null, 'modal-body');
    body.innerHTML = htmlStore.get(this.page);
    return body;
  },

  _generateModalFooter: function () {
    const footer = util.div(null, null, 'modal-footer');

    const left = util.div();
    left.style.float = 'left';
    left.appendChild(this._generateCancelButton());
    footer.appendChild(left);

    const buttons = this._generateFooterButtons();
    if (buttons.length > 0) {
      const right = util.div(null, null, 'modal-footer-btn-container');
      for (let i = 0; i < buttons.length; i++) {
        right.appendChild(buttons[i]);
      }
      footer.appendChild(right);
    }

    return footer;
  },

  _generateCancelButton: function () {
    const modal = this;
    return util.button(null, 'close', 'modal-footer-btn modal-btn-cancel', function () {
      modal._hide();
    });
  },

  _generateFooterButtons: function () {
    const buttons = [];
    if (this.handler.reject) {
      buttons.push(this._generateRejectButton());
    }
    if (this.handler.apply) {
      buttons.push(this._generateConfirmButton());
    }
    return buttons;
  },

  _generateConfirmButton: function () {
    const modal = this;
    return util.button(null, 'apply', 'modal-footer-btn modal-btn-confirm', function () {
      modal._confirm();
    });
  },

  _generateRejectButton: function () {
    const modal = this;
    return util.button(null, 'reject', 'modal-footer-btn modal-btn-confirm', function () {
      modal._reject();
    });
  },

  // LISTENER

  _generateMouseListener: function () {
    const modal = this;
    return function (event) {
      if (event && event.srcElement && event.srcElement.id === modal.modalEl.id) {
        modal._hide();
      }
    }
  },

  _generateKeyListener: function () {
    const modal = this;
    return function (event) {
      if (event && event.keyCode === 27) {
        modal._hide();
      }
    }
  },

  // ACTIONS

  show: function (data, title) {
    // create modal
    this._generateModal();
    sessionData.incModalOpenedCount();

    // init handler
    if (data) {
      this.handler.init(data);
    }

    // set title
    if (title) {
      this.setTitle(title);
    }
  },

  _hide: function () {
    // remove listener
    document.removeEventListener('mousedown', this.mouseListener);
    document.removeEventListener('keyup', this.keyListener);

    // remove modal
    document.body.removeChild(this.modalEl);
    sessionData.decModalOpenedCount();

    // callback for on hide action
    this.onHide();
  },

  onHide: function () {
  },

  _confirm: function () {
    if (this.handler.apply()) {
      this._hide();
    }
  },

  _reject: function () {
    if (this.handler.reject()) {
      this._hide();
    }
  },

  setTitle: function (text) {
    util.setValue('modal-header-span', text);
  }

};
