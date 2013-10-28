'use strict';

var _ = require('lodash');
var Q = require('q');

function BatchUpdate(model) {
  this.model = model;
  this.results = [];
  this.deferred = Q.defer();
}

BatchUpdate.prototype.process = function (batch) {
  var self = this;
  if (batch.length === 0) {
    return self.deferred.resolve(self.results);
  }
  var item = batch.shift();
  self.model.load(item.id, function (err, resource) {
    if (err) {
      self.results.push(404);
      self.process(batch);
    } else {
      _.extend(resource, item.patch);
      resource.save(function (err) {
        self.results.push(err ? 500 : 200);
        self.process(batch);
      });
    }
  });
  return self.deferred.promise;
};

module.exports = BatchUpdate;
