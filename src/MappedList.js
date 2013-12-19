define([
  'underscore',
  'eventemitter2',

  'List',
  'ComputedProperty'
],

function(_, EventEmitter, List, ComputedProperty) {

  var mapValue = function(value, mapFn) {
    return new ComputedProperty(function() {
      return mapFn(value.get());
    });
  };

  var addIndex = function(index, callback) {
    return function(newVal, oldVal) {
      callback(newVal, oldVal, index);
    };
  };

  function MappedList(values, mapFn) {
    var self = this;

    this.mapFn     = mapFn;
    this.list      = new List(values);
    this.listeners = [];

    this.mapped = _.map(this.list.get(), function(value, index) {
      var comp = mapValue(value, mapFn);
      comp.on('change', self.listeners[index] = addIndex(index, self._watchValue(index)));
      return comp;
    });

    this.list.on('update', this.onUpdate.bind(this));
    this.list.on('add', this.onAdd.bind(this));
    this.list.on('remove', this.onRemove.bind(this));
  }

  _.extend(MappedList.prototype, EventEmitter.prototype);

  MappedList.prototype.get = function() {
    return this.mapped;
  };

  MappedList.prototype.at = function(index) {
    return this.mapped[index];
  };

  MappedList.prototype._onUpdate = function(newVal, oldVal, index) {
    var old       = this.mapped[index],
        newMapped = this.mapFn(newVal);

    old.off('change', this.listeners[index]);
    newMapped.on('change', this.listeners[index] = addIndex(index, this._watchValue(index)));

    this.mapped.update(index, newMapped);
    this.emit('update', newMapped, old);
  };

  MappedList.prototype._onAdd = function(newVals, indexes) {
    var newMapped = _.map(newVals, this.mapFn);

    _.each(newMapped, function(comp, index) {
      comp.on('change', self.listeners[index] = addIndex(index, self._watchValue(index)));
    });

    this.mapped.push(newMapped);
    this.emit('add', newMapped, indexes);
  };

  MappedList.prototype._onRemove = function(oldVals, indexes) {
    var self = this,
        old = _.map(indexes, function(index) {
          return self.mapped[index];
        });

    _.each(old, function(comp, index) {
      comp.off('change', self.listeners[index]);
      delete self.listeners[index];
    });

    this.emit('remove', old, indexes);
  };

  MappedList.prototype._watchValue = function(index) {
    var self = this;

    return function(newVal, oldVal, index) {
      self.emit('update', newVal, oldVal, index);
    };
  };

  return MappedList;

});
