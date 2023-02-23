function BandDetail(id) {
  BandDetail.prototype._generate(id);
}

BandDetail.prototype = {

  _generate: function (id) {
    util.setValue(id, htmlStore.get('/components/bandDetail/bandDetail.html'));
  },

  update: async function (selectedBand) {
    // TODO get discography differences
    const band = await ApiService.getBand(selectedBand.id);
    util.setValue('bd-name', selectedBand.id + ' ' + selectedBand.name);
  }

};
