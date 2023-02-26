function AlbumDiff(id) {
  this.id = id;
}

AlbumDiff.prototype = {

  DIFF_TYPE_MAP: {
    'EQUAL': '',
    'PLUS': '+',
    'MINUS': '-',
    'CHANGE': '<>'
  },

  STATUS_MAP: {
    'NONE': '?',
    'NOT_PRESENT': 'x',
    'PRESENT': 'v',
    'TMP': '-'
  },

  WARNING_MAP: {
    'NONE|PRESENT': 'NOT_PRESENT',
    'NOT_PRESENT|PRESENT': 'NOT_PRESENT'
  },

  id: null,

  update(delta) {
    let changes = delta.changes

    // create table
    const table = util.emptyTable(this.id);

    // create header
    const tr = util.tr(table);
    util.td(tr);
    util.td(tr);
    util.td(tr);
    util.td(tr);
    util.td(tr, changes + ' differences');
    util.td(tr);
    util.td(tr, 'DB');
    util.td(tr, 'MP3');
    util.td(tr, 'Cover');
    util.td(tr, 'Scans');

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
          this._rowsChange(table, changes, diff.type, diff.original, diff.revised);
          break
      }
    });
  },

  _rows(table, diffType, albums) {
    albums.forEach(album => this._row(table, diffType, album));
  },

  _row(table, diffType, a) {
    const tr = util.tr(table, 'ad-' + diffType);

    // diffType
    util.td(tr, this.DIFF_TYPE_MAP[diffType], 'bl');

    // position
    util.td(tr, a.position);

    // type
    const type = a.maType ? '<i title="' + a.type + '">' + a.maType + '*</i>' : a.type;
    util.td(tr, type);

    // typeCount
    const typeCount = a.maTypeCount ? '<i title="' + util.int2(a.typeCount) + '">' + util.int2(a.maTypeCount) + '*</i>' : util.int2(a.typeCount);
    util.td(tr, typeCount);

    // name
    const name = a.maName ? '<i title="' + a.name + '">' + a.maName + '*</i>' : a.name;
    util.td(tr, name);

    // year
    util.td(tr, a.year);

    // calculate warning
    const warningStatus = (a.status === 'PRESENT' && a.statusMP3 !== 'PRESENT') || (a.status !== 'PRESENT' && a.statusMP3 === 'PRESENT');

    // status db
    util.td(tr, this.STATUS_MAP[a.status], 'ad-' + (warningStatus ? 'NOT_PRESENT' : (a.status === 'PRESENT' ? a.status : '')));

    // status mp3
    util.td(tr, this.STATUS_MAP[a.statusMP3], 'ad-' + (warningStatus ? 'NOT_PRESENT' : (a.statusMP3 === 'PRESENT' ? a.statusMP3 : '')));

    // status cover
    util.td(tr, this.STATUS_MAP[a.statusCover], 'ad-' + (a.statusCover === 'PRESENT' ? a.statusCover : ''));

    // status scans
    util.td(tr, this.STATUS_MAP[a.statusScans], 'ad-' + (a.statusScans === 'PRESENT' ? a.statusScans : ''));

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
      // FIXME empty rows
      const tr = null;
      for (; i < revised.length; i++) {
        this._rowRevised(tr, revised[i]);
      }
    }
  },

  _rowRevised(tr, a, className) {
    // position
    util.td(tr, a.position, className);

    // type
    util.td(tr, a.type, className);

    // typeCount
    util.td(tr, util.int2(a.typeCount), className);

    // name
    util.td(tr, a.name, className);

    // year
    util.td(tr, a.year, className);
  }

};
