define([
  'underscore',
  'require',
  'eventemitter2',

  'Property'
],

function(_, require, EventEmitter, Property)  {

  var toProperties = function(values) {
    return _.map(values, Property.toProperty);
  };

  var watchValue = function(index) {
    this.emit('update', this.at(index), index);
  };

  function List(values) {
    var self = this;

    this.values    = toProperties(values);
    this.matchers  = [];

    _.each(this.values, function(value, index) {
      value.on('change', self.matchers[index] = watchValue.bind(self, index));
    });
  }

  _.extend(List.prototype, EventEmitter.prototype);

  List.isList = function(values) {
    return values instanceof List ||
           values instanceof require('MappedList') ||
           values instanceof require('FilteredList');
  };

  List.toList = function(values) {
    return List.isList(values) ? values : new List(values);
  };

  List.prototype.size = function() {
    return this.values.length;
  };

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
      prop.off('change', self.matchers[index]);
    });

    this.matchers = [];
    this.values   = [];
    this.emit('remove', old, _.range(old.length));
  };

  List.prototype.set = function(newVals) {
    if (this.values.length) this.clear();
    this.push.apply(this, newVals);
  };

  List.prototype.update = function(index, value) {
    var old    = this.at(index),
        newVal = Property.toProperty(value);

    old.off('change', this.matchers[index]);
    newVal.on('change', this.matchers[index] = watchValue.bind(this, index));

    this.values[index] = newVal;
    this.emit('update', newVal, index);
  };

  List.prototype.insert = function(index, value) {
    var newVal = Property.toProperty(value);

    this.matchers.splice(index, 0, watchValue.bind(this, index));
    newVal.on('change', this.matchers[index]);

    this.values.splice(index, 0, newVal);
    this.emit('add', [newVal], [index]);
  };

  List.prototype.remove = function(index) {
    var old = this.values[index];

    old.off('change', this.matchers[index]);

    this.matchers.splice(index, 1);
    this.values.splice(index, 1);

    this.emit('remove', [old], [index]);
  };

  List.prototype.push = function() {
    var self  = this,
        args  = Array.prototype.slice.call(arguments),
        props = toProperties(args),
        old   = this.values;

    _.each(props, function(prop, index) {
      prop.on('change', self.matchers[index] = watchValue.bind(self, index));
    });

    this.values = this.values.concat(props);
    this.emit('add', props, _.range(old.length, old.length + this.values.length));
  };

  return List;

});
