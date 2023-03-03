const Home = {

  bandList: null,
  bandDetail: null,
  albumDetailModal: null,

  init() {
    // create components
    this.bandList = new BandList('hmBandList');
    this.bandDetail = new BandDetail('hmBandDetail');
    this.albumDetailModal = new AlbumDetailModal();

    // init bands
    this.bandList.init();
  }

};
