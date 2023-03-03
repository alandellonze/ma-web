function BandDetail(id) {
  this._generate(id);
}

BandDetail.prototype = {

  albumDiff: null,
  mp3Diff: null,
  coversDiff: null,
  scansDiff: null,
  selectedBand: null,

  _generate(id) {
    util.setValue(id, htmlStore.get('/components/bandDetail/bandDetail.html'));

    // init diff component
    this.albumDiff = new AlbumDiff('bdAlbumDiff', this);
    this.mp3Diff = new ItemDiff('bdMP3Diff', 'MP3');
    this.coversDiff = new ItemDiff('bdCoversDiff', 'Covers');
    this.scansDiff = new ItemDiff('bdScansDiff', 'Scans');
  },

  async update(selectedBand) {
    this.selectedBand = selectedBand;
    await this.reload();
  },

  async reload() {
    // load differences
    const diff = await ApiService.getDiff(this.selectedBand.id);

    // update band name
    util.setValue('bdName', this.selectedBand.name);

    // update diff components
    this.albumDiff.update(diff.albums);
    this.mp3Diff.update(diff.mp3);
    this.coversDiff.update(diff.covers);
    this.scansDiff.update(diff.scans);

    // show data
    util.show('bdContainer');
  }

};
