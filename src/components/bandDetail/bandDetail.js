function BandDetail(id) {
  this._generate(id);
}

BandDetail.prototype = {

  albumDiff: null,
  mp3Diff: null,
  coversDiff: null,
  scansDiff: null,

  _generate(id) {
    util.setValue(id, htmlStore.get('/components/bandDetail/bandDetail.html'));

    // init diff component
    this.albumDiff = new AlbumDiff('bdAlbumDiff');
    this.mp3Diff = new StringDiff('bdMP3Diff');
    this.coversDiff = new StringDiff('bdCoversDiff');
    this.scansDiff = new StringDiff('bdScansDiff');
  },

  async update(selectedBand) {
    // load differences
    const diff = await ApiService.getDiff(selectedBand.id);

    // update band name
    util.setValue('bdName', selectedBand.name);

    // update diff components
    this.albumDiff.update(diff.albums);
    this.mp3Diff.update(diff.mp3);
    this.coversDiff.update(diff.covers);
    this.scansDiff.update(diff.scans);

    // show data
    util.show('bdContainer');
  }

};
