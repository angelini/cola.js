define([
  'underscore',
  'eventemitter2',

  'List',
  'ComputedProperty'
],

function(_, EventEmitter, List, ComputedProperty) {

  var toList = function(values) {
    return List.isList(values) ? values : new List(values);
  };

  var mapValue = function(value, mapFn) {
    return new ComputedProperty(function() {
      return mapFn(value);
    });
  };

  var onUpdate = function(newVal, index) {
    var old       = this.mapped[index],
        newMapped = mapValue(newVal, this.mapFn);

    old.off('change', this.listeners[index]);
    newMapped.on('change', this.listeners[index] = watchValue.bind(this, index));

    this.mapped[index] = newMapped;
    this.emit('update', newMapped, old);
  };

  var onAdd = function(newVals, indexes) {
    var self = this;

    var newMapped = _.map(newVals, function(val) {
      return mapValue(val, self.mapFn);
    });

    _.each(newMapped, function(comp, iterationIndex) {
      var index = indexes[iterationIndex];

      self.mapped.splice(index, 0, comp);
      self.listeners.splice(index, 0, watchValue.bind(self, index));

      comp.on('change', self.listeners[index]);
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

      comp.off('change', self.listeners[index]);

      self.listeners.splice(index, 1);
      self.mapped.splice(index, 1);
    });

    this.emit('remove', old, indexes);
  };

  var watchValue = function(index) {
    this.emit('update', this.at(index), index);
  };

  function MappedList(values, mapFn) {
    var self = this;

    this.mapFn     = mapFn;
    this.list      = toList(values);
    this.listeners = [];

    this.mapped = _.map(this.list.get(), function(value, index) {
      var comp = mapValue(value, mapFn);
      comp.on('change', self.listeners[index] = watchValue.bind(self, index));
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
