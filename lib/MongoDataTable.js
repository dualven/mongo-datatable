var async = require('async');
var cols = require('./columns');
var validator = require('./validator');

function MongoDataTable(dbObject) {
  this.db = dbObject;
}

MongoDataTable.prototype.get = function(collectionName, options, onDataReady) {
  var self = this;
  var columns = cols.extractColumns(options);
  
  var response = {
    draw: 0,
    recordsTotal: 0,
    recordsFiltered: 0,
    data: [],
    error: null
  };

  function getCollectionLength(callback) {
    if (self.db === null || typeof self.db === 'undefined') {
      callback(new Error('You are not connected to any database server!'));
      return;
    }

    var searchCriteria = cols.buildSearchCriteria(options);
    var earlyCollection = self.db.collection(collectionName);
    response.draw = parseInt(options.draw, 10);

    earlyCollection
      .find(searchCriteria, columns)
      .count(function(error, result) {

        if (error) {
          callback(error, null);
          return;
        }

        response.recordsTotal = result;
        response.recordsFiltered = result;

        callback(null);
      });
  }

  function validateOptions(callback) {
    validator.isOptionsValid(options, callback);
  }

  function buildDefaultValue(callback) {
    // Default to true
    var emptyOnError = options.emptyOnError;
    if (typeof emptyOnError === 'undefined' || emptyOnError === null) {
      options.emptyOnError = true;
    }

    callback(null);
  }

  function getAndSortData(callback) {
    var sortOrder = cols.buildColumnSortOrder(options);
    var collection = self.db.collection(collectionName);
    var searchCriteria = cols.buildSearchCriteria(options);

    collection = collection.find(searchCriteria, columns)
      .skip(parseInt(options.start))
      .limit(parseInt(options.length))

    for (index in sortOrder) {
      collection = collection.sort(sortOrder[index]);
    }
    collection.toArray(callback);
  }

  function returnData(error, result) {
    if (error) {
      if (options.emptyOnError === true) {
        if (options.showAlert === true) {
          response.error = error.message;
        }

        onDataReady(error, response);
      }
      else {
        onDataReady(error, null);
      }

      return;
    }

    // Everything's ok!
    response.data = result;
    onDataReady(null, response);
  }

  var tasks = [
    validateOptions,
    buildDefaultValue,
    getCollectionLength,
    getAndSortData
  ];

  async.waterfall(tasks, returnData);
};

module.exports = MongoDataTable;