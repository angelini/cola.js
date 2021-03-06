define([
  'underscore',
  'eventemitter2',

  'List',
  'ComputedProperty'
],

function(_, EventEmitter, List, ComputedProperty) {

  var mapValue = function(value, mapFn) {
    return new ComputedProperty(function() {
      return mapFn(value);
    });
  };

  var onUpdate = function(newVal, index) {
    var old       = this.mapped[index],
        newMapped = mapValue(newVal, this.mapFn);

    old.off('change', this.matchers[index]);
    newMapped.on('change', this.matchers[index] = watchValue.bind(this, newVal));

    this.mapped[index] = newMapped;
    this.emit('update', newMapped, index);
  };

  var onAdd = function(newVals, indexes) {
    var self = this;

    var newMapped = _.map(newVals, function(val) {
      return mapValue(val, self.mapFn);
    });

    _.each(newMapped, function(comp, iterationIndex) {
      var index = indexes[iterationIndex];

      self.mapped.splice(index, 0, comp);
      self.matchers.splice(index, 0, watchValue.bind(self, newVals[iterationIndex]));

      comp.on('change', self.matchers[index]);
    });

    this.emit('add', newMapped, indexes);
  };

  var onRemove = function(oldVals, indexes) {
    var self = this,
        old = _.map(indexes, function(index) {
          return self.mapped[index];
        });

    _.each(old, function(comp, iterationIndex) {
      var index = indexes[iterationIndex];

      comp.off('change', self.matchers[index]);

      self.matchers.splice(index, 1);
      self.mapped.splice(index, 1);
    });

    this.emit('remove', old, indexes);
  };

  var watchValue = function(value) {
    this.emit('update', value, this.list.indexOf(value));
  };

  function MappedList(values, mapFn) {
    var self = this;

    this.mapFn    = mapFn;
    this.list     = List.toList(values);
    this.matchers = [];

    this.mapped = _.map(this.list.get(), function(value, index) {
      var comp = mapValue(value, mapFn);
      comp.on('change', self.matchers[index] = watchValue.bind(self, value));
      return comp;
    });

    this.list.on('update', onUpdate.bind(this));
    this.list.on('add', onAdd.bind(this));
    this.list.on('remove', onRemove.bind(this));
  }

  _.extend(MappedList.prototype, EventEmitter.prototype);

  MappedList.prototype.size = function() {
    return this.mapped.length;
  };

  MappedList.prototype.get = function() {
    return this.mapped;
  };

  MappedList.prototype.at = function(index) {
    return this.mapped[index];
  };

  return MappedList;

});
