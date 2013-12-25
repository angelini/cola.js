define([
  'underscore',
  'eventemitter2',

  'List',
  'MappedList'
],

function(_, EventEmitter, List, MappedList) {

  var filteredIndex = function(mappedList, index) {
    var result = 0;

    _.times(index, function(iterationIndex) {
      if (mappedList.at(iterationIndex).get()) result++;
    });

    return result;
  };

  var runFilter = function(list, mappedList) {
    return _.filter(list.get(), function(value, index) {
      return mappedList.at(index).get();
    });
  };

  var onUpdate = function(newVal, index) {
    this.filtered = runFilter(this.list, this.mappedList);

    if (newVal.get()) {
      this.emit('add', [this.list.at(index)], [filteredIndex(this.mappedList, index)]);
    } else {
      this.emit('remove', [this.list.at(index)], [filteredIndex(this.mappedList, index)]);
    }
  };

  var onAdd = function(newVals, indexes) {
    this.filtered = runFilter(this.list, this.mappedList);

    var self         = this,
        addedItems   = [],
        addedIndexes = [];

    _.each(newVals, function(newVal, iterationIndex) {
      var index = indexes[iterationIndex];

      if (newVal.get()) {
        addedItems.push(self.list.at(index));
        addedIndexes.push(filteredIndex(self.mappedList, index));
      }
    });

    if (addedItems.length) this.emit('add', addedItems, addedIndexes);
  };

  var onRemove = function(oldVals, indexes) {
    this.filtered = runFilter(this.list, this.mappedList);

    var self           = this,
        removedItems   = [],
        removedIndexes = [];

    _.each(oldVals, function(oldVal, iterationIndex) {
      var index = indexes[iterationIndex];

      if (self.filterFn(oldVal)) {
        removedItems.push(oldVal);
        removedIndexes.push(filteredIndex(self.mappedList, index));
      }
    });

    if (removedItems.length) this.emit('remove', removedItems, removedIndexes);
  };

  function FilteredList(values, filterFn) {
    var self = this;

    this.filterFn   = filterFn;
    this.list       = List.toList(values);
    this.mappedList = new MappedList(this.list, function(value) {
      return filterFn(value);
    });

    this.filtered = runFilter(this.list, this.mappedList);

    this.mappedList.on('update', onUpdate.bind(this));
    this.mappedList.on('add', onAdd.bind(this));

    this.list.on('remove', onRemove.bind(this));
    this.list.on('update', function(newVal, index) {
      if (self.mappedList.at(index).get()) {
        self.emit('update', newVal, filteredIndex(self.mappedList, index));
      }
    });
  }

  _.extend(FilteredList.prototype, EventEmitter.prototype);

  FilteredList.prototype.size = function() {
    return this.filtered.length;
  };

  FilteredList.prototype.get = function() {
    return this.filtered;
  };

  FilteredList.prototype.at = function(index) {
    return this.filtered[index];
  };

  return FilteredList;

});
