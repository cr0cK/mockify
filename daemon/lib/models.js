module.exports = (function () {
  'use strict';

  return {
    /**
     * Response model
     */
    Response: function (db) {
      /* jscs:disable disallowSpaceAfterObjectKeys */
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
        proxyId     : Number

      }, {
        cache       : false,
        methods     : {
          // fullName: function () {
          //   return this.name + ' ' + this.surname;
          // }
        }
        // validations: {
        //   age: orm.enforce.ranges.number(18, undefined, 'under-age')
        // }
      });
      /* jscs:enable disallowSpaceAfterObjectKeys */
    },

    /**
     * Target model
     */
    Target: function (db) {
      /* jscs:disable disallowSpaceAfterObjectKeys */
      return db.define('target', {
        port        : Number,
        url         : String
      }, {
        cache       : false,
        methods     : {
          // fullName: function () {
          //   return this.name + ' ' + this.surname;
          // }
        }
        // validations: {
        //   age: orm.enforce.ranges.number(18, undefined, 'under-age')
        // }
      });
      /* jscs:enable disallowSpaceAfterObjectKeys */
    }
  };
})();
