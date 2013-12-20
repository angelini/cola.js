define([
  'Property',
  'ComputedProperty',
  'List',
  'MappedList',
  'FilteredList'
],

function(Property, ComputedProperty, List, MappedList, FilteredList) {

  describe('List', function() {

    it('can be created with no arguments', function() {
      var list = new List();
      expect(list.get()).toEqual([]);
    });

    it('should map each value to a Property', function() {
      var values = [1, "hello", {a: 1}, new Property(3)],
          list   = new List(values);

      _.each(list.get(), function(value) {
        expect(Property.isProperty(value)).toBe(true);
      });
    });

    it('should fire an update if a value is changed', function() {
      var list      = new List([1, 2]),
          updateSpy = jasmine.createSpy('updateSpy');

      list.on('update', updateSpy);
      expect(updateSpy).not.toHaveBeenCalled();

      list.get()[1].set(3);
      expect(updateSpy.calls[0].args[0].get()).toBe(3);
      expect(updateSpy.calls[0].args[1]).toBe(1);
    });

    it('can insert values at arbitrary indexes', function() {
      var list   = new List([1, 2, 4]),
          addSpy = jasmine.createSpy('addSpy');

      list.on('add', addSpy);
      list.insert(2, 3);

      expect(Property.isProperty(list.at(2))).toBe(true);
      expect(list.at(2).get()).toBe(3);
      expect(addSpy.calls[0].args[0][0].get()).toBe(3);
    });

    it('should not longer emit once cleared', function() {
      var list      = new List([1, 2, 3]),
          two       = list.get()[1],
          updateSpy = jasmine.createSpy('updateSpy');

      list.on('update', updateSpy);
      list.clear();

      two.set(4);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('can reset all of it\'s values', function() {
      var init = [new Property(1), new Property(2), new Property(3)],
          end  = [new Property('foo'), new Property('bar')];

      var list      = new List(init),
          addSpy    = jasmine.createSpy('addSpy'),
          removeSpy = jasmine.createSpy('removeSpy');

      list.on('add', addSpy);
      list.on('remove', removeSpy);

      list.set(end);

      expect(removeSpy.calls[0].args[0]).toEqual(init);
      expect(removeSpy.calls[0].args[1]).toEqual([0, 1, 2]);
      expect(addSpy.calls[0].args[0]).toEqual(end);
      expect(addSpy.calls[0].args[1]).toEqual([0, 1]);
    });

    it('should append all arguments to push', function() {
      var list   = new List([1, 2, 3]),
          addSpy = jasmine.createSpy('addSpy');

      list.on('add', addSpy);
      list.push(4, 5);

      expect(addSpy).toHaveBeenCalled();
      expect(list.get().length).toBe(5);
    });

  });

  describe('MappedList', function() {
    var list;

    beforeEach(function() {
      list = new List([1, 2, 3]);
    });

    it('should build a list of computed properties', function() {
      var map = new MappedList(list, function(item) {
        return item.get() + 1;
      });

      expect(map.size()).toBe(3);
      expect(map.at(0)).toEqual(jasmine.any(ComputedProperty));
      expect(map.at(0).get()).toBe(2);
    });

    it('should recalculate a value when it\'s original value changes', function() {
      var map = new MappedList(list, function(item) {
        return item.get() + 1;
      });

      expect(map.at(1).get()).toBe(3);

      list.update(1, 5);
      expect(map.at(1).get()).toBe(6);
    });

    it('should recalculate a value when another dep changes', function() {
      var dep = new Property(3),
          map = new MappedList(list, function(item) {
            return item.get() + dep.get();
          });

      expect(map.at(2).get()).toBe(6);

      dep.set(5);
      expect(map.at(2).get()).toBe(8);
    });

    it('should add in new values as their are added to the original list', function() {
      var map = new MappedList(list, function(item) {
        return item.get() + 1;
      });

      list.push(4);
      list.insert(1, -1);

      expect(map.at(4).get()).toBe(5);
      expect(map.at(1).get()).toBe(0);
    });

    it('should remove values as their are removed from the original list', function() {
      var map = new MappedList(list, function(item) {
        return item.get() + 1;
      });

      list.remove(0);

      expect(map.size()).toBe(2);
    });

  });

  describe('FilteredList', function() {
    var list;

    beforeEach(function() {
      list = new List([1, 2, 3, 4]);
    });

    it('should filter list elements using the input function', function() {
      var filtered = new FilteredList(list, function(item) {
        return item.get() > 2;
      });

      expect(filtered.size()).toBe(2);
      expect(filtered.get()[0]).toEqual(jasmine.any(Property));
      expect(filtered.get()[1].get()).toBe(4);
    });

    it('should update as changing items pass the filter', function() {
      var filtered = new FilteredList(list, function(item) {
        return item.get() > 2;
      });

      list.update(1, 5);
      expect(filtered.size()).toBe(3);

      list.update(3, 1);
      expect(filtered.size()).toBe(2);
    });

    it('should update as other deps cause the filter to pass', function() {
      var dep      = new Property(false),
          filtered = new FilteredList(list, function(item) {
            return dep.get() && item.get();
          });

      expect(filtered.size()).toBe(0);

      dep.set(true);
      expect(filtered.size()).toBe(4);
    });

    it('should grow if newly added values pass the filter', function() {
      var filtered = new FilteredList(list, function(item) {
        return item.get() > 2;
      });

      list.push(2, 5);
      expect(filtered.size()).toBe(3);
    });

    it('should shrink as passing values are removed', function() {
      var filtered = new FilteredList(list, function(item) {
        return item.get() > 2;
      });

      list.remove(0);
      list.remove(2);

      expect(filtered.size()).toBe(1);
    });

  });

});
