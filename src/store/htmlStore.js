const htmlStore = {

  cache: {},

  get(key) {
    // load from server if not in the cache
    if (!this.cache[key]) {
      // load from the server
      const xmlHttp = util.createXmlHttpRequest();
      xmlHttp.open('GET', key, false);
      xmlHttp.send();

      // put in the cache
      this.cache[key] = xmlHttp.responseText;
    }

    // return value from the cache
    return this.cache[key];
  }

};
