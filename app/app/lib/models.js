'use strict';

module.exports = {
  /**
   * Create an empty Sqlite database.
   */
  Response: function (db) {
    return db.define('response', {
      dateCreated : Date,
      path        : String,
      method      : String,
      headers     : Object,
      parameters  : Object,
      body        : Object,
      acceptContentType: String,
      contentType : String,
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
