function BandList(id) {
  this._generate(id);
}

BandList.prototype = {

  bandSelected: null,

  _generate(id) {
    util.setValue(id, htmlStore.get('/components/bandList/bandList.html'));

    // bind events
    const self = this;
    let timeoutId;
    util.id('blFilter').onkeydown = () => clearTimeout(timeoutId);
    util.id('blFilter').onkeyup = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => await self._loadBands(), 250);
    };
  },

  async init() {
    // init bands
    await this._loadBands();
  },

  async _loadBands() {
    const filter = util.getValue('blFilter');
    const bands = await ApiService.getBands(filter);
    this._updateBands(bands);
  },

  _updateBands(bands) {
    // empty table
    const table = util.id('blTable',true);

    // add rows
    bands.forEach(band => this._addRow(table, band));
  },

  _addRow(table, band) {
    const self = this;
    const tr = util.tr(table);
    util.td(tr, band.name, null, () => self._selectBand(band), null, 'band_' + band.id);
  },

  _selectBand(band) {
    // refresh selection
    this._refreshSelection(band);

    // update detail
    Home.bandDetail.update(band);
  },

  _refreshSelection(band) {
    // remove selection on previous element
    if (this.bandSelected) {
      util.removeClass('band_' + this.bandSelected.id, 'bl-selected');
    }

    // add selection on next element
    util.addClass('band_' + band.id, 'bl-selected');

    // update element selected
    this.bandSelected = band;
  }

};
