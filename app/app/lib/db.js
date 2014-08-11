/* global path */

'use strict';

module.exports = function () {
  var fs = require('fs'),
      path = require('path'),
      file = 'db.sqlite',
      absFile = path.join(process.env.PWD, file),
      connexionString = 'sqlite://' + absFile,
      schema = [
        'CREATE  TABLE "main"."response"',
        ' ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,',
        ' "date_created" DATETIME NOT NULL DEFAULT CURRENT_DATE,',
        ' "path" VARCHAR NOT NULL,',
        ' "verb" VARCHAR NOT NULL,',
        ' "headers" TEXT NOT NULL,',
        ' "parameters" TEXT NOT NULL,',
        ' "body" TEXT NOT NULL,',
        ' "accept-content-type" VARCHAR NOT NULL,',
        ' "content-type" VARCHAR NOT NULL,',
        ' "comments" TEXT)'].join(''),
      exists = fs.existsSync(file),
      sqlite3 = require('sqlite3').verbose(),
      db = new sqlite3.Database(absFile);


  // var orm = require('orm');
  // orm.connect('sqlite://D:/Dropbox/sites/myblog/db',function (err,db) {

  db.serialize(function() {
    if (!exists) {
      db.run(schema);
    }
  });

  return {};

  //   saveResponse: function (object) {
  //     db.serialize(function() {
  //       var query = ['
  //         INSERT INTO response ("date_created", "") VALUES (?)
  //     });
  //   }
  // }

  // db.serialize(function() {
  //   if (!exists) {
  //     db.run(schema);
  //   }

  //   var stmt = db.prepare('INSERT INTO Stuff VALUES (?)');

  //   // Insert random data
  //   var rnd;
  //   for (var i = 0; i < 10; i++) {
  //     rnd = Math.floor(Math.random() * 10000000);
  //     stmt.run('Thing #' + rnd);
  //   }

  //   stmt.finalize();

  //   db.each('SELECT rowid AS id, thing FROM Stuff', function(err, row) {
  //     console.log(row.id + ': ' + row.thing);
  //   });

  //   db.close();
  // });

};
