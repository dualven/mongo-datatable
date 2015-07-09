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

Argument:

* `db` - An instance of `Db` from `mongodb` module. 

### MongoDataTable.prototype.get(collection, options, callback)

This function validates the `options` argument and checks the connection to database. If the `options` is invalid and the connection to database is null, the callback will be called immediately with error. If everything is ok, the callback will be called with `result` containing documents from collection `collection`.

#### Search Operation

* If both individual column and global search value are not given, then the search query will be an empty object. Therefore this function will fetch all documents inside the collection.

* If there is no individual column's search value is given and global search value is given, then the global search value will be used as each column's search value. Then, the search query will be like `{ $or: [{ column_0: value }, ... , column_n: value }] }`.

* If there is one or more individual column's search value is given and the global search value is not given, then the search query will be like `{ column_0: value, ... , column_n: value }`.

* If both individual column and global search value are given, then the search query will be like `{ column_0: value, column_1: value, $or: [{ column_2 : value }, ... , { column_n: value }`.

Arguments:

* `collection` - A string represents name of a collection in your database.
* `options` - An object identic to [sent parameter](https://www.datatables.net/manual/server-side#Sent-parameters) by jquery datatables.
* `callback(error, result)` - The `result` parameter is an object identic to  [returned data](https://www.datatables.net/manual/server-side#Returned-data) to jquery datatables.

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
  MongoClient.connect('mongodb://localhost/database', function(err, db) {
    new MongoDataTable(db).get('collection', req.query, function(err, result) {
      res.json(resulr);
    });
  });
});
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
  var db = new Db('database', new Server('localhost', 27017));
  
  db.open(function(error, db) {
    new MongoDataTable(db).get('collection', req.query, function(err, result) {
      res.json(result);
    });
  });
});
```
