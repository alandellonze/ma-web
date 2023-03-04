const AlbumDetail = {

  GENRE_MAP: {
    '9': 'Metal'
  },

  init(mp3Folder) {
    //  init album
    this._initAlbum(mp3Folder.album, mp3Folder.cover);

    // init mp3
    this._initCDMP3s(mp3Folder.cdMP3Map);
  },

  _initAlbum(a, cover) {
    const table = util.id('adAlbum');

    const tr1 = util.tr(table);
    util.td(tr1, util.img(null, ApiService.buildCoverPath(cover), 'ad-img'));

    /*
    const tr2 = util.tr(table);
    util.td(tr2, a.bandName);

    const tr3 = util.tr(table);
    util.td(tr3, albumUtil.type(a) + ' ' + albumUtil.typeCount(a));

    const tr4 = util.tr(table);
    util.td(tr4, albumUtil.name(a) + ' (' + a.year + ')');
    */
  },

  _initCDMP3s(cdMP3Map) {
    const cds = Object.keys(cdMP3Map);
    if (cds.length > 0) {
      const parent = util.id('adMP3s');

      const self = this;
      cds.forEach((cd) => {
        const mp3s = cdMP3Map[cd];
        self._initCDMP3(parent, cd, mp3s);
      });
    }
  },

  _initCDMP3(parent, cd, mp3s) {
    // cd name
    if (cd.length > 0) {
      util.div(parent, cd, 'pt10');
    }

    // create table
    const table = util.table(parent);

    // header
    const tr = util.tr(table, 'header bt');
    util.td(tr, 'File name', 'bl');
    util.td(tr, 'Artist');
    util.td(tr, 'Album');
    util.td(tr, 'Track');
    util.td(tr, 'Title');
    util.td(tr, 'Duration');
    util.td(tr, 'Year');
    util.td(tr, 'Genre');
    util.td(tr, 'Bitrate');

    // rows
    mp3s.forEach(mp3 => {
      this._rowMP3(table, mp3);
    });
  },

  _rowMP3(table, mp3) {
    const tr = util.tr(table);
    util.td(tr, mp3.fileName.substring(mp3.fileName.lastIndexOf('/') + 1), 'bl');
    util.td(tr, mp3.artist);
    util.td(tr, mp3.album);
    util.td(tr, mp3.track);
    util.td(tr, mp3.title);
    util.td(tr, mp3.duration);
    util.td(tr, mp3.year);
    util.td(tr, this.GENRE_MAP[mp3.genre]);
    util.td(tr, mp3.bitrate);
  },

  apply() {
    return true;
  }

};
