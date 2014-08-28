'use strict';

module.exports = {
  /**
   * Create an empty Sqlite database.
   */
  Response: function (db) {
    return db.define('response', {
      uuid        : String,
      dateCreated : Date,
      status      : Number,
      url         : String,
      method      : String,
      parameters  : Object,
      reqHeaders  : Object,
      resHeaders  : Object,
      body        : Object,
      comment     : String,
      apiId       : Number
    }, {
      methods: {
        // fullName: function () {
        //   return this.name + ' ' + this.surname;
        // }
      }
      // validations: {
      //   age: orm.enforce.ranges.number(18, undefined, 'under-age')
      // }
    });
  },

  /**
   * Return the model `model`.
   */
  Api: function (db) {
    return db.define('api', {
      url         : String,
      enabled     : Boolean
    }, {
      methods: {
        // fullName: function () {
        //   return this.name + ' ' + this.surname;
        // }
      }
      // validations: {
      //   age: orm.enforce.ranges.number(18, undefined, 'under-age')
      // }
    });
  }
};
