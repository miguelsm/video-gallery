'use strict';

var Q = require('q');

function BatchRemove(model) {
  this.model = model;
  this.results = [];
  this.deferred = Q.defer();
}

BatchRemove.prototype.process = function (batch) {
  var self = this;
  if (batch.length === 0) {
    return self.deferred.resolve(self.results);
  }
  var id = batch.shift();
  self.model.load(id, function (err, resource) {
    if (err) {
      self.results.push(404);
      self.process(batch);
    } else {
      resource.remove(function (err) {
        self.results.push(err ? 500 : 200);
        self.process(batch);
      });
    }
  });
  return self.deferred.promise;
};

module.exports = BatchRemove;
