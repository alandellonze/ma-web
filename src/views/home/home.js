const Home = {

  data: null,

  _resetData() {
    this.data = {};
  },

  async init() {
    // reset
    this._resetData();

    // create components
    const bandList = new BandList('hmBandList');
    const bandDetail = new BandDetail('hmBandDetail');

    // init bands
    await bandList.init(bandDetail);
  }

};
