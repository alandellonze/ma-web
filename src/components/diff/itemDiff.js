function ItemDiff(id, kind) {
  this.id = id;
  this.kind = kind;
}

ItemDiff.prototype = {

  DIFF_TYPE_MAP: {
    'EQUAL': 'v',
    'PLUS': '+',
    'MINUS': 'x',
    'CHANGE': '<>'
  },

  id: null,
  kind: null,

  update(delta) {
    // create table
    const table = util.id(this.id,true);

    // create header
    const tr = util.tr(table, 'header');
    util.td(tr, this.kind + ' ' + delta.changes + ' differences');
    util.td(tr);

    // create rows
    delta.diffs.forEach(diff => {
      switch (diff.type) {
        case 'EQUAL':
        case 'MINUS':
          this._rows(table, diff.type, diff.original);
          break

        case 'PLUS':
          this._rows(table, diff.type, diff.revised);
          break

        case 'CHANGE':
          this._rowsChange(table, delta.changes, diff.type, diff.original, diff.revised);
          break
      }
    });
  },

  _rows(table, diffType, albums) {
    for (let i = 0; i < albums.length; i++) {
      this._row(table, diffType, albums[i]);
    }
  },

  _row(table, diffType, a) {
    const self = this;

    // action on row select
    const tr = util.tr(table, null, () => self._openAlbum(a));

    // name
    util.td(tr, a.name, 'bl');

    // diffType
    util.td(tr, this.DIFF_TYPE_MAP[diffType], 'ac df-i-' + diffType);

    return tr;
  },

  _rowsChange(table, changes, diffType, original, revised) {
    let i = 0

    for (; i < original.length; i++) {
      // add the original album
      const tr = this._row(table, diffType, original[i]);

      // add the revised album (on the right side)
      if (i < revised.length) {
        this._rowRevised(tr, revised[i], i === 0 ? 'bt' : null);
      }
    }

    // add the remaining revised album (on the right side)
    if (i < revised.length) {
      for (; i < revised.length; i++) {
        const tr = util.tr(table, 'ad-' + diffType);

        // add empty td
        util.td(tr, null, null, null, 2);

        // add the revised album (on the right side)
        this._rowRevised(tr, revised[i]);
      }
    }
  },

  _rowRevised(tr, a, className) {
    // position
    util.td(tr, a.name, className);
  },

  async _openAlbum(a) {
    // load album content
    const mp3Folder = await ApiService.getMP3(a.albumId);

    // build title
    const album = mp3Folder.album;
    const title = album.bandName + ' - ' + albumUtil.type(album, true) + albumUtil.typeCount(album) + ' - ' + albumUtil.name(album) + ' (' + album.year + ')';

    // open album into a modal
    Home.albumDetailModal.show(mp3Folder, title);
  }

};
