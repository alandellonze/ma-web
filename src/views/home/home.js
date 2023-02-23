const Home = {

  data: null,

  _resetData: function () {
    this.data = {};
  },

  init: async function () {
    // reset
    this._resetData();

    // create components
    const bandList = new BandList('bandList');
    const bandDetail = new BandDetail('bandDetail');

    // init bands
    await bandList.init(bandDetail);
  }

};
