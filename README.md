# Mongo DataTable

NodeJS module for server-side processing using jquery datatables and mongodb native driver.

Supports:

* datatables >= 1.10
* mongodb >= 2.0 (native driver)
* MongoDB >= 2.4

## Install

```bash
npm install mongo-datatable
```

## Documentation
This module returns `MongoDataTable` constructor when loaded using `require('mongo-datatable')`.

### MongoDataTable(db)

This constructor takes one argument and must be instantiated using `new` keyword.

__Argument:__

* `db` - An instance of `Db` from `mongodb` module. 

### MongoDataTable.prototype.get(collection, options, callback)

This method validates the `options` argument and checks the connection to database. If the `options` is invalid or there is no connection made to database, the callback will be called immediately with error. If everything is ok, the callback will be called with `result`.

__Arguments:__

* `collection` - A string represents name of a collection in your database.
* `options` - An object identic to [sent parameter](https://www.datatables.net/manual/server-side#Sent-parameters) by jquery datatables.
* `callback(error, result)` - The `result` parameter is an object identic to  [returned data](https://www.datatables.net/manual/server-side#Returned-data) to jquery datatables.

__Extra Options:__

* `emptyOnError` - If this field is set to `true` and `callback` is called with `error`, the `result` won't be null, but instead it will contain [returned data](https://www.datatables.net/manual/server-side#Returned-data) with `data` property set to an empty array. The default value is `true`.
* `showAlert` - If this field is set to `true` and `callback` is called with `error`, the error message will be displayed to the user by the datatables. The default value is `false`. If the `emptyOnError` is set to false, this field will be ignored.

#### Search Operation

* If both individual column and global search value are not given, then the search query will be an empty object. Therefore this method will fetch all documents inside the collection.

* If there is no individual column search value is given and global search value is given, then the global search value will be used as each column's search value. Then, the search query will be like `{ $or: [{ column_0: value }, ... , { column_n: value }] }`.

* If there is one or more individual column search value is given and the global search value is not given, then the search query will be like `{ column_0: value_0, ... , column_n: value_n }`.

* If both individual column and global search value are given, then the search query will be like `{ column_0: value_0, column_1: value_1, $or: [{ column_2 : value }, ... , { column_n: value }] }`.


## Usage

Examples below are using express >= 4.0

* Using `MongoClient`

```js
var express = require('express');
var mongodb = require('mongodb');
var MongoDataTable = require('mongo-datatable');
var MongoClient = mongodb.MongoClient;
var router = express.Router();

router.get('/data.json', function(req, res, next) {
  var options = req.query;
  options.showAlert = true;
  
  MongoClient.connect('mongodb://localhost/database', function(err, db) {
    new MongoDataTable(db).get('collection', options, function(err, result) {
      res.json(result);
    });
  });
});
...
```

* Using `Db` and `Server`

```js
var express = require('express');
var mongodb = require('mongodb');
var MongoDataTable = require('mongo-datatable');
var Db = mongodb.Db;
var Server = mongodb.Server;
var router = express.Router();

router.get('/data.json', function(req, res, next) {
  var options = req.query;
  options.showAlert = true;
  var db = new Db('database', new Server('localhost', 27017));
  
  db.open(function(error, db) {
    new MongoDataTable(db).get('collection', req.query, function(err, result) {
      res.json(result);
    });
  });
});
...
```