'use strict';

const mongodb = require('mongodb');
const co = require('co');

const Mapper = require('./Mapper');

/**
 * MongoDb mapper
 *
 * @alias MapperMongoDb
 * @constructor
 *
 * @see Mapper
 *
 * @param {Object} options - Queue configuration
 * @param {String} [options.url=mongodb://localhost:27017/test] - AMQP Read Channel URL
 *
 * @example
 *
 * // Require the mapper class:
 * const MapperMongoDb = require('MapperMongoDb');
 *
 * // Instanciate the mapper with default values:
 * const mapper = new MapperMongoDb();
 *
 * // Connect the database:
 * yield mapper.connect();
 *
 * // Perform tasks such as loading objects:
 * const user = mapper.getObject(_id, User);
 */
class MapperMongoDb extends Mapper {
  constructor(options) {
    super(options);

    // Set the default database connection:
    this.options.url = this.options.url || 'mongodb://localhost:27017/test';
  }

  /**
   * Connect the database
   *
   * @return {MapperMongoDb} - The database mapper
   */
  * connect() {
    this.connection = yield mongodb.connect(this.options.url);
    return this;
  }

  /**
   * Close the database
   *
   * @return {MapperMongoDb} - The database mapper
   */
  * close() {
    if (this.connection) {
      this.connection.close();
    }
    this.connection = null;
    return this;
  }

  /**
   * Retrieve the object collection name from the object given in parameter, the
   * constructor or prototype.
   *
   * @return {String} - The collection name
   */
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

  /**
   * Retrieve the object collection.
   *
   * @return {Object} - The collection for this object
   */
  getObjectCollection(obj) {
    return this.connection.collection(
      this.getObjectCollectionName(obj)
    );
  }

  /**
   * Save an object to the mongoDb database.
   *
   * @param {Object} - Object to persist to the database
   * @return {Object} - New instance of the object
   */
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

  /**
   * Load an object from the mongoDb database.
   *
   * @param {String|ObjectId} _id - Object _id to search for
   * @param {Contructor} constructor - Constructor to use to instanciate the
   *                                   object
   * @return {Object} - Instance
   */
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

  /**
   * Remove an object from the mongoDb database.
   *
   * @param {Object} - Object to delete from the database
   * @return {Object} - Instance
   */
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
