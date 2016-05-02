'use strict';

const MapperInterface = require('./MapperInterface');

class MapperAbstract extends MapperInterface {
  constructor(options) {
    super(options);

    this.options = options || {};
  }
}

module.exports = MapperAbstract;
