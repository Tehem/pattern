'use strict';

const mongodb = require('mongodb');
const co = require('co');

const MapperAbstract = require('./MapperAbstract');

class MapperMongoDb extends MapperAbstract {
  constructor(options) {
    super(options);

    // Set the default database connection:
    this.options.url = this.options.url || 'mongodb://localhost:27017/test';
  }

  * connect() {
    this.connection = yield mongodb.connect(this.options.url);
    return this;
  }
  * close() {
    if (this.connection) {
      this.connection.close();
    }
    this.connection = null;
    return this;
  }

  getObjectCollectionName(obj) {
    // Get the constructor name:
    let name = null;
    if (typeof obj === 'string') {
      name = obj;
    }
    if (!name && obj.constructor
      && typeof obj.constructor.prototype.collection === 'function') {
      name = obj.constructor.prototype.collection();
    }
    if (!name && obj.prototype && obj.prototype.constructor.name) {
      name = obj.prototype.constructor.name.toLowerCase();
    }
    if (!name) {
      name = obj.constructor.name.toLowerCase();
    }
    return name;
  }

  getObjectCollection(obj) {
    return this.connection.collection(
      this.getObjectCollectionName(obj)
    );
  }

  saveObject(obj) {
    const self = this;
    return co(function* saveObject() {
      // Get the object data:
      const data = obj.toJSON();

      // Map the Mongodb _id to ObjectId:
      if (typeof data._id === 'string') {
        data._id = mongodb.ObjectId(data._id); // eslint-disable-line new-cap
      }

      // Save the object to the database:
      yield self
        .getObjectCollection(obj)
        .save(data);

      // Map reverse type:
      data._id = data._id.toString();

      // Return a new instance of the object:
      return new obj.constructor(data);
    });
  }

  getObject(_id, constructor) {
    const self = this;
    return co(function* getObject() {
      let objectId = _id;
      // Map the Mongodb _id to ObjectId:
      if (typeof objectId === 'string') {
        objectId = mongodb.ObjectId(objectId);// eslint-disable-line new-cap
      }
      // Save the object to the database:
      const data = yield self
        .getObjectCollection(constructor)
        .findOne({ _id: objectId });

      if (data === null) {
        return null;
      }

      // @refactor
      data._id = data._id.toString();

      // Return a new instance of the object:
      return new constructor(data);
    });
  }

  deleteObject(obj) {
    const self = this;
    return co(function* deleteObject() {
      const data = obj.toJSON();
      // Map the Mongodb _id to ObjectId:
      data._id = mongodb.ObjectId(data._id); // eslint-disable-line new-cap
      // Save the object to the database:
      yield self
        .getObjectCollection(obj)
        .remove({ _id: data._id });
      // Return a new instance of the object:
      return obj;
    });
  }
}

module.exports = MapperMongoDb;
