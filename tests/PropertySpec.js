define([
  'src/PropertyStack',
  'src/Property',
  'src/ComputedProperty'
],

function(PropertyStack, Property, ComputedProperty) {

  describe('Property', function() {

    it('should set a default value', function() {
      var prop = new Property('default');
      expect(prop.value).toBe('default');
    });

    it('should get and set values', function() {
      var prop = new Property();
      prop.set('value');

      expect(prop.value).toBe('value');
      expect(prop.get()).toBe('value');
    });

    it('should emit change events', function() {
      var prop = new Property('first');
      var changeCb = jasmine.createSpy('changeCb');

      prop.on('change', changeCb);

      expect(changeCb).not.toHaveBeenCalled();
      prop.set('second');
      expect(changeCb).toHaveBeenCalledWith('second', 'first');
    });

  });

  describe('Property Stack', function() {

    beforeEach(function() {
      PropertyStack.empty();
    });

    it('should return but not pop the top element on peek', function() {
      PropertyStack.push(1);
      PropertyStack.push(2);

      expect(PropertyStack.peek()).toBe(2);
      expect(PropertyStack.length()).toBe(2);
    });

  });

  describe('Computed Property', function() {

    beforeEach(function() {
      PropertyStack.empty();
    });

    it('should set a function argument as the getter', function() {
      var fn = function() {};
      var prop = new ComputedProperty(fn);
      expect(prop.getter).toBe(fn);
    });

    it('should compute it\'s value on get', function() {
      var dep = new Property(3);
      var get = function() { return dep.get() + 2; };
      var prop = new ComputedProperty(get);

      expect(prop.get()).toBe(5);
      expect(prop.value).toBe(5);
    });

    it('should add fetched properties to it\'s dependencies', function() {
      var dep = new Property(3);
      var get = function() { return dep.get() + 2; };
      var prop = new ComputedProperty(get);

      prop.get();
      expect(prop.dependencies.length).toBe(1);
      expect(prop.dependencies[0]).toBe(dep);
    });

    it('should recalculate it\'s value when a dependency changes', function() {
      var dep = new Property(3);
      var get = function() { return dep.get() + 2; };
      var prop = new ComputedProperty(get);
     
      expect(prop.get()).toBe(5);

      dep.set(5);
      expect(prop.value).toBe(7);
    });

    it('should only leave one listener on a dep after multiple gets', function() {
      var dep = new Property(3);
      var get = function() { return dep.get() + 2; };
      var prop = new ComputedProperty(get);
    
      prop.get();
      prop.get();

      expect(dep.listeners('change').length).toBe(1);
    });

    it('should emit change events', function() {
      var dep = new Property(3);
      var get = function() { return dep.get() + 2; };
      var prop = new ComputedProperty(get);

      var changeCb = jasmine.createSpy('changeCb');
      prop.on('change', changeCb);

      expect(changeCb).not.toHaveBeenCalled();
      dep.set(5);
      expect(changeCb).toHaveBeenCalledWith(7, 5);
    });

  });


});
