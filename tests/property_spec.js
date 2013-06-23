describe('Property', function() {

  it('should set a default value', function() {
    var prop = new Cola.Property('default');
    expect(prop.value).toBe('default');
  });

  it('should get and set values', function() {
    var prop = new Cola.Property();
    prop.set('value');

    expect(prop.value).toBe('value');
    expect(prop.get()).toBe('value');
  });

});

describe('Property Stack', function() {

  beforeEach(function() {
    Cola.PropertyStack.empty();
  });

  it('should return but not pop the top element on peek', function() {
    Cola.PropertyStack.push(1);
    Cola.PropertyStack.push(2);

    expect(Cola.PropertyStack.peek()).toBe(2);
    expect(Cola.PropertyStack.length()).toBe(2);
  });

});

describe('Computed Property', function() {

  beforeEach(function() {
    Cola.PropertyStack.empty();
  });

  it('should set a default value', function() {
    var prop = new Cola.ComputedProperty({defaultValue: 'default'});
    expect(prop.value).toBe('default');
  });

  it('should set a function argument as the getter', function() {
    var fn = function() {};
    var prop = new Cola.ComputedProperty(fn);
    expect(prop.getter).toBe(fn);
  });

  it('should compute it\'s value on get', function() {
    var dep = new Cola.Property(3);
    var get = function() { return dep.get() + 2; };
    var prop = new Cola.ComputedProperty(get);

    expect(prop.get()).toBe(5);
    expect(prop.value).toBe(5);
  });

  it('should add fetched properties to it\'s dependencies', function() {
    var dep = new Cola.Property(3);
    var get = function() { return dep.get() + 2; };
    var prop = new Cola.ComputedProperty(get);

    prop.get();
    expect(prop.dependencies.length).toBe(1);
    expect(prop.dependencies[0]).toBe(dep);
  });

  it('should recalculate it\'s value when a dependency changes', function() {
    var dep = new Cola.Property(3);
    var get = function() { return dep.get() + 2; };
    var prop = new Cola.ComputedProperty(get);
   
    expect(prop.get()).toBe(5);

    dep.set(5);
    expect(prop.value).toBe(7);
  });

  it('should only leave one listener on a dep after multiple gets', function() {
    var dep = new Cola.Property(3);
    var get = function() { return dep.get() + 2; };
    var prop = new Cola.ComputedProperty(get);
  
    prop.get();
    prop.get();

    expect(dep.listeners('change').length).toBe(1);
  });

});
