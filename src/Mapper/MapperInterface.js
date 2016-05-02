'use strict';

class MapperInterface {
  constructor() {
    if (new.target === MapperInterface) {
      throw new TypeError('Cannot construct Interfaces instances directly');
    }
  }

  saveObject(obj) { // eslint-disable-line no-unused-vars
    throw new TypeError('Must override method');
  }

  getObject() {
    throw new TypeError('Must override method');
  }

  deleteObject() {
    throw new TypeError('Must override method');
  }

  findObjects() {
    throw new TypeError('Must override method');
  }
}

module.exports = MapperInterface;
