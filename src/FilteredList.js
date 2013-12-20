define([
  'underscore',
  'eventemitter2',

  'List',
  'MappedList'
],

function(_, EventEmitter, List, MappedList) {

  var rerunFilter = function() {
    var self = this;

    this.filtered = _.filter(this.list.get(), function(value, index) {
      return self.filterMap.at(index).get();
    });

    this.emit('change', this.filtered);
  };

  function FilteredList(values, filterFn) {
    this.list      = List.toList(values);
    this.filterMap = new MappedList(this.list, function(value) {
      return filterFn(value);
    });

    rerunFilter.call(this);

    this.filterMap.on('update', rerunFilter.bind(this));
    this.filterMap.on('add', rerunFilter.bind(this));
    this.filterMap.on('remove', rerunFilter.bind(this));
  }

  _.extend(FilteredList.prototype, EventEmitter.prototype);

  FilteredList.prototype.size = function() {
    return this.filtered.length;
  };

  FilteredList.prototype.get = function() {
    return this.filtered;
  };

  return FilteredList;

});
