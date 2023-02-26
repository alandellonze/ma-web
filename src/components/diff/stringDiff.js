function StringDiff(id) {
  this.id = id;
}

StringDiff.prototype = {

  DIFF_TYPE_MAP: {
    'EQUAL': 'v',
    'PLUS': '+',
    'MINUS': 'x',
    'CHANGE': '<>'
  },

  id: null,

  update(delta) {
    let changes = delta.changes

    // create table
    const table = util.emptyTable(this.id);

    // create header
    const tr = util.tr(table);
    util.td(tr);
    util.td(tr, changes + ' differences');

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
    const tr = util.tr(table);

    // diffType
    util.td(tr, this.DIFF_TYPE_MAP[diffType], 'bl ad-' + diffType);

    // name
    util.td(tr, a);

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
    util.td(tr, a, className);
  }

};
