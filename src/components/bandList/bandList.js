function BandList(id) {
  BandList.prototype._generate(id);
}

BandList.prototype = {

  _generate: function (id) {
    util.setValue(id, htmlStore.get('/components/bandList/bandList.html'));
  },

  init: async function (bandDetail) {
    // set band detail component
    BandList.prototype.bandDetail = bandDetail;

    // init bands
    await BandList.prototype._loadBands();
  },

  _loadBands: async function () {
    const bandsFilter = util.getValue('bandsFilter');
    const bands = await ApiService.getBands(bandsFilter);
    BandList.prototype._updateBands(bands);
  },

  _updateBands: function (bands) {
    // empty table
    const table = util.emptyTable('bandsTable');

    // add rows
    bands.forEach(band => BandList.prototype._addRow(table, band));
  },

  _addRow: function (table, band) {
    const tr = util.tr(table);
    util.td(band.name, function () {
      BandList.prototype._selectBand(band);
    }, tr);
  },

  _selectBand: function (band) {
    BandList.prototype.bandDetail.update(band);
  }

};
