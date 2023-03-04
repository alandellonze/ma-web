function Modal(handler, page) {
  this.handler = handler;
  this.page = page;
}

Modal.prototype = {

  handler: undefined,
  page: undefined,

  _modalEl: undefined,
  _mouseListener: undefined,
  _keyListener: undefined,

  show(data, title) {
    // add the modal to the page
    this._addModal(title);

    // increment the amount of modal opened
    sessionData.incModalOpenedCount();

    // init handler
    if (data) {
      this.handler.init(data);
    }
  },

  _close() {
    // callback for close action
    if (this.handler.onClose) {
      this.handler.onClose();
    }

    // hide modal
    this._hide();
  },

  _apply() {
    // callback for apply action
    if (this.handler.apply()) {
      this._hide();
    }
  },

  _hide() {
    // remove listener
    document.removeEventListener('mousedown', this._mouseListener);
    document.removeEventListener('keyup', this._keyListener);

    // remove the modal from the page
    document.body.removeChild(this._modalEl);

    // decrement the amount of modal opened
    sessionData.decModalOpenedCount();

    // callback for on hide action
    if (this.handler.onHide) {
      this.handler.onHide();
    }
  },

  // CREATE MODAL

  _addModal(title) {
    // generate the modal
    const modalId = ('' + Math.random()).replace('.', '');
    this._modalEl = util.div(document.body, this._buildModal(title), 'md-el', null, modalId);

    // translate the labels
    labels.translateLabelsInPage();

    // add listener to hide the modal by clicking outside or by hitting escape
    this._mouseListener = this._generateMouseListener();
    this._keyListener = this._generateKeyListener();
    document.addEventListener('mousedown', this._mouseListener);
    document.addEventListener('keyup', this._keyListener);
  },

  _buildModal(title) {
    const content = util.div(null, null, 'md-content');

    // header
    title = title ? title : this.handler.title ? labels.translate(this.handler.title) : '';
    util.div(content, title, 'md-header');

    // body
    util.div(content, htmlStore.get(this.page), 'md-body');

    // footer
    this._buildFooter(content);

    return content;
  },

  _buildFooter(content) {
    const self = this;

    // footer container
    const footer = util.div(content, null, 'md-footer');

    // close button
    util.button(footer, labels.translate('close'), 'md-button close', () => self._close());

    // apply button
    if (this.handler.apply) {
      util.button(footer, labels.translate('apply'), 'md-button apply', () => self._apply());
    }

    return footer;
  },

  // LISTENER

  _generateMouseListener() {
    const self = this;
    return (event) => {
      if (event && event.srcElement && event.srcElement.id === self._modalEl.id) {
        self._hide();
      }
    }
  },

  _generateKeyListener() {
    const self = this;
    return (event) => {
      if (event && event.keyCode === 27) {
        self._hide();
      }
    }
  }

};
