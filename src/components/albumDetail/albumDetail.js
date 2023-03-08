const AlbumDetail = {

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
    const cds = Object.keys(cdMP3Map).sort();
    const hasCDs = cds.length > 0;
    if (hasCDs) {
      const parent = util.id('adMP3s');

      const self = this;
      cds.forEach(cd => {
        const mp3s = cdMP3Map[cd];
        self._initCDMP3(parent, cd, mp3s);
      });
    }

    // show / hide mp3s
    util.show('adMP3s', hasCDs);
  },

  _initCDMP3(parent, cd, mp3s) {
    // cd name
    if (cd.length > 0) {
      util.div(parent, cd, 'ad-cd');
    }

    // create table
    const table = util.table(parent, 'pb20');

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
    util.td(tr, mp3.genre + (mp3.genreDescription ? ' (' + mp3.genreDescription + ')' : ''));
    util.td(tr, mp3.bitrate);

    // draw issues when present
    if (this._mp3HasOk(mp3) || this._mp3HasIssues(mp3) || mp3.issueCover) {
      this._rowMP3Issues(table, mp3);
    }
  },

  _mp3HasOk(mp3) {
    return mp3.okTrack || mp3.okArtist || mp3.okTrack || mp3.okTitle || mp3.okAlbum || mp3.okYear || mp3.okGenre;
  },

  _mp3HasIssues(mp3) {
    return mp3.issueId3v1Tag || !mp3.issueId3v2Tag || mp3.issueCustomTag || mp3.itemsToBeCleared;
  },

  _rowMP3Issues(table, mp3) {
    const tr = util.tr(table, 'ad-mp3-issues');

    // tag differences
    if (this._mp3HasOk(mp3)) {
      util.td(tr, mp3.okFilename ? mp3.okFilename : '', 'bl');
      util.td(tr, mp3.okArtist ? mp3.okArtist : '');
      util.td(tr, mp3.okAlbum ? mp3.okAlbum : '');
      util.td(tr, mp3.okTrack ? mp3.okTrack : '');
      util.td(tr, mp3.okTitle ? mp3.okTitle : '');
      util.td(tr);
      util.td(tr, mp3.okYear ? mp3.okYear : '');
      util.td(tr, mp3.okGenre ? mp3.okGenre : '' + (mp3.okGenreDescription ? ' (' + mp3.okGenreDescription + ')' : ''));
      util.td(tr);
    } else {
      util.td(tr, null, 'bl', null, 9);
    }

    // general issues
    if (this._mp3HasIssues(mp3)) {
      let content = '';
      if (mp3.issueId3v1Tag) {
        content += '* ' + labels.translate('issueID3v1') + '<br/>';
      }
      if (!mp3.issueId3v2Tag) {
        content += '* ' + labels.translate('issueID3v2') + '<br/>';
      }
      if (mp3.issueCustomTag) {
        content += '* ' + labels.translate('issueCustomTag') + '<br/>';
      }
      if (mp3.itemsToBeCleared) {
        content += '* ' + mp3.itemsToBeCleared;
      }
      util.td(tr, content, 'bt');
    }

    // cover issues
    if (mp3.issueCover) {
      const originalCoverPresent = mp3.originalCover.length > 0;
      let coverContent;
      if (originalCoverPresent) {
        coverContent = util.img(null, 'data:image/png;base64,' + mp3.originalCover, 'ad-img');
      } else {
        coverContent = '* ' + labels.translate('issueCover');
      }
      util.td(tr, coverContent, 'bt' + (originalCoverPresent ? ' p0' : ''));
    }
  },

  apply() {
    return true;
  }

};
