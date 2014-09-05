module.exports = (function () {
  'use strict';

  var _         = require('lodash'),
      _s        = require('underscore.string'),
      fs        = require('fs'),
      path      = require('path'),
      orm       = require('orm'),
      sqlite3   = require('sqlite3').verbose(),
      exec      = require('child_process').exec,
      os        = require('os'),
      Q         = require('q');

  var file      = 'db.sqlite',
      absFile   = path.join(process.env.PWD, file),
      conStr    = 'sqlite://' + absFile,
      exists    = fs.existsSync(file),
      models    = require('./models'),
      schemas   = [
        'CREATE  TABLE "main"."response"' +
        ' ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,' +
        // index on uuid to improve speed
        ' "uuid" VARCHAR UNIQUE NOT NULL,' +
        ' "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_DATE,' +
        // can be null because it will be updated when receiving the response
        ' "status" INTEGER,' +
        ' "url" VARCHAR NOT NULL,' +
        ' "method" VARCHAR NOT NULL,' +
        ' "parameters" TEXT NOT NULL,' +
        ' "reqHeaders" TEXT NOT NULL,' +
        // can be null because it will be updated when receiving the response
        ' "resHeaders" TEXT,' +
        // can be null because it will be updated when receiving the response
        ' "body" TEXT,' +
        ' "comment" TEXT,' +
        ' "proxyId" INTEGER,' +
        // replace if the query is the same than a previous one
        ' UNIQUE (status, url, method, parameters) ON CONFLICT REPLACE)',

        'CREATE  TABLE "main"."proxy"' +
        ' ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL,' +
        ' "port" INTEGER NOT NULL,' +
        ' "target" VARCHAR NOT NULL,' +
        ' "isRecording" INTEGER NOT NULL, ' +
        ' "isDisabled" INTEGER NOT NULL)'
      ],
      guid      = require('./helper').guid,
      models_   = {},
      promise   ;

  /**
   * Connect ORM to the DB.
   * Use deferred in order to wait the connection before being able to get
   * models.
   */
  promise = (function () {
    var deferred = Q.defer();

    if (!_.isEmpty(models_)) {
      deferred.promise;
    }

    orm.connect(conStr, function (err, db) {
      if (err) {
        var clc = require('cli-color');
        console.log(clc.red('Can\'t connect to the Sqlite database.'));
        throw err;
      }

      _.forEach(models, function (model, modelName) {
        models_[modelName] = model(db);
      });

      deferred.resolve();
    });

    return deferred.promise;
  })();

  return {
    /**
     * Return the promise, resolved when models are ready.
     */
    whenReady: function () {
      return promise;
    },

    /**
     * Create an empty Sqlite database.
     *
     * If a `schemas_` is defined, the database is created in-memory.
     * (Used by the toMemory() method of this module)
     */
    create: function (schemas_) {
      var dest = schemas_ ? ':memory:' : absFile;
      var db = new sqlite3.Database(dest);
      var localSchemas =
        (schemas_ && _.without(schemas_.split('\n'), '')) || schemas;

      db.serialize(function () {
        if (schemas_ || !exists) {
          _.forEach(localSchemas, function (schema) {
            db.run(schema);
          });
        }
      });

      return this;
    },

    /**
     * Return the model `model`.
     * Return a promise.
     */
    model: function (model) {
      return _.has(models_, model) && models_[model];
    },

    /**
     * Return a new Sqlite3 instance mapped to an in-memory dabatase
     * filled with the content of the SQLite database saved on the disk.
     *
     * Will be used to create a temporary mock.
     *
     * Since it seems there is no way to dump a SQLite file with NodeJS,
     * we do a shell call.
     * Therefore, the "sqlite3" binary must be installed on the system.
     */
    toMemory: function (callback) {
      var self = this;
      var file = 'mocKr_dump_' + guid() + '.sql';
      var destFile = path.join(os.tmpDir(), file);
      var cmdLind = 'sqlite3 ' + absFile + ' .dump > ' + destFile;

      // dump the SQLite database into a temp file
      exec(cmdLind, function (err, stdout, stderr) {
        if (err) {
          var errs = [];

          errs.push(
            'An error has occurred when trying to dump the SQLite file: ',
            _s.trim(stderr));

          if (/not found/.test(stderr)) {
            errs.push(
              'Try to install sqlite binary: sudo apt-get install sqlite3');
          }

          // call the callback with the error
          return callback(errs.join('\n'), undefined);
        }

        // read file
        var dumpSql = fs.readFileSync(destFile);

        // delete file since its content has been read
        fs.unlinkSync(destFile);

        // call the callback without error and with a new instance of this
        // module with a in-memory database mapped to the dump SQL
        return callback(undefined, self.create(dumpSql.toString('utf-8')));
      });
    },

    /**
     * Log stuff on stdout.
     * Used like that: Proxy.save(db.log);
     */
    log: function (err) {
      err && !_.isNull(err) && console.log(err);
    }
  };
})();
