'use strict';

const EventEmitter = require('events').EventEmitter;

/**
 * Queue object extending the EventEmitter class.
 * @class Queue
 *
 * @constructor
 *
 * @param {Object} options EventEmitter object configuration
 */
class Queue extends EventEmitter {
  constructor(options) {
    const _options = Object.assign({}, options || {});
    super(_options);

    this._options = _options;
  }

  /**
   * Connect the queue.d
   */
  connect() {
    return Promise.resolve(true);
  }
}

module.exports = Queue;
