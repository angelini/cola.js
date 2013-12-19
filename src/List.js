define([
  'underscore',
  'eventemitter2',

  'Property'
],

function(_, EventEmitter, Property) {

  var toProperty = function(value) {
    return Property.isProperty(value) ? value : new Property(value);
  };

  var toProperties = function(values) {
    return _.map(values, toProperty);
  };

  function List(values) {
    var self = this;

    this.values    = toProperties(values);
    this.listeners = [];

    _.each(this.values, function(value, index) {
      value.on('change', self.listeners[index] = self._watchValue(index));
    });
  }

  _.extend(List.prototype, EventEmitter.prototype);

  List.prototype.at = function(index) {
    return this.values[index];
  };

  List.prototype.get = function() {
    return this.values;
  };

  List.prototype.clear = function() {
    var self = this,
        old  = this.values;

    _.each(old, function(prop, index) {
      prop.off('change', self.listeners[index]);
    });

    this.listeners = [];
    this.values    = [];
    this.emit('remove', old, _.range(old.length));
  };

  List.prototype.update = function(index, value) {
    var old    = this.at(index),
        newVal = toProperty(value);

    old.off('change', this.listeners[index]);
    newVal.on('change', this.listeners[index] = this._watchValue(index));

    this.values[index] = newVal;
    this.emit('update', newVal, old, index);
  };

  List.prototype.insert = function(index, value) {
    var newVal = toProperty(value);

    this.listeners.splice(index, 0, this._watchValue(index));
    newVal.on('change', this.listeners[index]);

    this.values.splice(index, 0, newVal);
    this.emit('add', [value], [index]);
  };

  List.prototype.remove = function(index) {
    var old = this.values[index];

    old.off('change', this.listeners[index]);
    delete this.listeners[index];

    this.values.splice(index, 1);
    this.emit('remove', [old], index);
  };

  List.prototype.push = function() {
    var self  = this,
        args  = Array.prototype.slice.call(arguments),
        props = toProperties(props),
        old   = this.values;

    _.each(props, function(prop, index) {
      prop.on('change', self.listeners[index] = self._watchValue(index));
    });

    this.values = this.values.concat(props);
    this.emit('add', props, _.range(old.length, this.values.length));
  };

  List.prototype._watchValue = function(index) {
    var self = this;

    return function(newVal, oldVal) {
      self.emit('update', newVal, oldVal, index);
    };
  };

  return List;

});
