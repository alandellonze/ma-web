const AlbumDetail = {

  GENRE_MAP: {
    '9': 'Metal'
  },

  init: function (data) {
    const table = util.id('adMP3s');

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
    data.mp3s.forEach(mp3 => {
      this._row(table, mp3);
    });
  },

  _row(table, mp3) {
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

  apply: function () {
    return true;
  }

};
