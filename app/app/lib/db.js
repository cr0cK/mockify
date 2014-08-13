'use strict';

var _         = require('lodash'),
    fs        = require('fs'),
    path      = require('path'),
    orm       = require('orm');

var file      = 'db.sqlite',
    absFile   = path.join(process.env.PWD, file),
    conStr    = 'sqlite://' + absFile,
    exists    = fs.existsSync(file),
    models    = require('./models'),
    schemas = [
      'CREATE  TABLE "main"."response"' +
      ' ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,' +
      ' "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_DATE,' +
      ' "path" VARCHAR NOT NULL,' +
      ' "method" VARCHAR NOT NULL,' +
      ' "headers" TEXT NOT NULL,' +
      ' "parameters" TEXT NOT NULL,' +
      ' "body" TEXT NOT NULL,' +
      ' "acceptContentType" VARCHAR NOT NULL,' +
      ' "contentType" VARCHAR NOT NULL,' +
      ' "comment" TEXT,' +
      ' "apiId" INTEGER)',
      'CREATE  TABLE "main"."api"' +
      ' ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL ,' +
      ' "url" VARCHAR NOT NULL ,' +
      ' "enabled" BOOL NOT NULL )'
    ];

var _models = {};

/**
 * Init models.
 */
orm.connect(conStr, function (err, db) {
  if (err) {
    var clc = require('cli-color');
    console.log(clc.red('Can\'t connect to the Sqlite database.'));
    throw err;
  }

  _.forEach(models, function (model, modelName) {
    _models[modelName] = model(db);
  });
});


module.exports = {
  /**
   * Create an empty Sqlite database.
   */
  create: function () {
    var sqlite3 = require('sqlite3').verbose(),
        db      = new sqlite3.Database(absFile);

    db.serialize(function() {
      if (!exists) {
        _.forEach(schemas, function (schema) {
          db.run(schema);
        });
      }
    });
  },

  /**
   * Return the model `model`.
   */
  model: function (model) {
    return _.has(_models, model) && _models[model];
  }
};
