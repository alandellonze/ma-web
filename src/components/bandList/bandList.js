function BandList(id) {
  this._generate(id);
}

BandList.prototype = {

  bandDetail: null,

  _generate(id) {
    util.setValue(id, htmlStore.get('/components/bandList/bandList.html'));

    // bind events
    const self = this;
    util.id('blFilter').onkeyup = async function () {
      await self._loadBands();
    };
  },

  async init(bandDetail) {
    // set bandDetail component
    this.bandDetail = bandDetail;

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
    const table = util.emptyTable('blTable');

    // add rows
    bands.forEach(band => this._addRow(table, band));
  },

  _addRow(table, band) {
    const self = this;
    const tr = util.tr(table);
    util.td(tr, band.name, null, function () {
      self._selectBand(band);
    });
  },

  _selectBand(band) {
    this.bandDetail.update(band);
  }

};
