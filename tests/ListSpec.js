define([
  'Property',
  'List',
  'MappedList'
],

function(Property, List, MappedList) {

  describe('List', function() {

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
      expect(updateSpy).toHaveBeenCalledWith(3, 2, 1);
    });

    it('can insert values at arbitrary indexes', function() {
      var list   = new List([1, 2, 4]),
          addSpy = jasmine.createSpy('addSpy');

      list.on('add', addSpy);
      list.insert(2, 3);

      expect(Property.isProperty(list.get()[2])).toBe(true);
      expect(list.get()[2].get()).toBe(3);
      expect(addSpy).toHaveBeenCalledWith([3], [2]);
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

  });

});
