const albumUtil = {

  type(a, ignoreFL) {
    if (ignoreFL) {
      const type = a.maType ? a.maType : a.type;
      return type === 'FULLLENGTH' ? '' : type;
    }

    return a.maType ? '<i title="' + a.type + '">' + a.maType + '*</i>' : a.type;
  },

  typeCount(a) {
    return a.maTypeCount ? '<i title="' + util.int2(a.typeCount) + '">' + util.int2(a.maTypeCount) + '*</i>' : util.int2(a.typeCount);
  },

  name(a) {
    return a.maName ? '<i title="' + a.name + '">' + a.maName + '*</i>' : a.name;
  }

};
