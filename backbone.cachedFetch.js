// Backbone.CachedFetch, v1.0.0
// ----------------------------------
//
// Copyright (c) 2015 Pavel Komiagin
// Distributed under MIT license
//
// http://github.com/pavelkomiagin/backbone.cachedfetch
(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone'], function(_, Backbone) {
      return factory(_, Backbone);
    });
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    var Backbone = require('backbone');
    module.exports = factory(_, Backbone);
  } else {
    factory(root._, root.Backbone);
  }

}(this, function(_, Backbone) {
  'use strict';

  // Helpers
  // -------
  // localStorage with expiration
  var StoreWithExpiration = function() {
    return {
      set: function(key, value, expireTime) {
        var item = {
          value: value,
          expireTime: expireTime,
          cachedAt: new Date().getTime()
        };

        try {
          localStorage.setItem(key, JSON.stringify(item));
        } catch(e) {}
      },

      get: function(key) {
        try {
          var info = JSON.parse(localStorage.getItem(key));

          if (!info || new Date().getTime() - info.cachedAt > info.expireTime)
            return null;

          return info.value;

        } catch(e) {
          localStorage.removeItem(key);
        }
      }
    };
  };

  var expirationStore = new StoreWithExpiration();
  Backbone.Collection = Backbone.Collection.extend({

    cachedFetch: function(options) {
      options = options || {};
      var expireTime = options.expireTime || 60 * 60 * 1000;
      var cacheKey = 'bbCollection_' + this.url;

      if (!window.localStorage)
        return this.fetch(options);

      var cachedData = expirationStore.get(cacheKey);
      var cachedModels = cachedData ? cachedData.value : [];
      var success = options.success;

      if (!cachedData) {
        options.success = _.bind(function (resp) {
          if (success)
            success.call(options.context, this, resp, options);

          expirationStore.set(cacheKey, this.models, expireTime);

        }, this);
        return this.fetch(options);

      } else {

        options = _.extend({parse: true}, options);
        var method = options.reset ? 'reset' : 'set';
        this[method](cachedModels, options);

        if (success)
          success.call(options.context, this, cachedModels, options);

        this.trigger('sync', this, cachedModels, options);
        return this.sync('cachedRead', this, options);
      }
    }
  });

  Backbone.Model = Backbone.Model.extend({

    cachedFetch: function(options) {
      options = options || {};
      var expireTime = options.expireTime || 60 * 60 * 1000;
      var cacheKey = 'bbModel_' + this.url + '_' + this.id;

      if (!window.localStorage)
        return this.fetch(options);

      var cachedData = expirationStore.get(cacheKey);
      var cachedModel = cachedData ? cachedData.value : {};
      var success = options.success;

      if (!cachedData) {
        options.success = _.bind(function (resp) {
          if (success)
            success.call(options.context, this, resp, options);

          expirationStore.set(cacheKey, this.models, expireTime);

        }, this);
        return this.fetch(options);

      } else {

        options = _.extend({parse: true}, options);
        var serverAttrs = options.parse ? model.parse(cachedModel, options) : cachedModel;

        if (!model.set(serverAttrs, options))
          return false;

        if (success)
          success.call(options.context, this, cachedModel, options);

        this.trigger('sync', this, cachedModel, options);
        return this.sync('cachedRead', this, options);
      }
    }
  });

  var _sync = Backbone.sync;
  Backbone.sync = function(method, model, options) {
    if (method === 'cachedRead') {

      var _getCacheKey = function() {
        return model.collection ? 'bbModel_' + model.url + '_' + model.id : 'bbCollection_' + model.url;
      };

      var _getCachedValue = function() {
        var cachedData = expirationStore.get(_getCacheKey());
        var empty = model.collection ? {} : [];
        return cachedData ? cachedData.value : empty;
      };

      if (options.success)
        options.success(_getCachedValue());

    } else {
      return _sync.apply(this, arguments);
    }
  }
}));