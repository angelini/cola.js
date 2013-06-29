define([
  'src/Property',
  'src/ComputedProperty',
  'src/Keypath',
  'src/Parser',
  'src/Binding'
],

function(Property, ComputedProperty, Keypath, Parser, Binding) {

  describe('Keypath', function() {

    it('should keep a map of all keypaths', function() {
      var key = new Keypath('test', new Property('value'));
      var prop = Keypath.lookup('test');
      expect(prop.get()).toBe('value');
    });

    it('should create the property if the name is not in the map', function() {
      var prop = Keypath.lookup('not.present');
      expect(prop).toEqual(jasmine.any(Property));
    });

  });

  describe('Parser', function() {
    var div;

    beforeEach(function() {
      div = document.createElement('div');
      div.innerHTML = ['<div>',
                       '  <p>Test</p>',
                       '  <span></span>',
                       '</div>',
                       '<div>',
                       '  <div>',
                       '    <p></p>',
                       '  </div>',
                       '</div>'
                      ].join('');
    });

    it('should iterate over every node', function() {
      var parser = new Parser(div);
      spyOn(parser, 'nextNode').andCallThrough();

      parser.parse();

      expect(parser.nextNode.callCount).toBe(7);
    });

    it('should detect data-bind attributes', function() {
      var parser = new Parser(div);
      
      div.firstChild.setAttribute('data-bind', 'keypath');
      div.lastChild.firstElementChild.setAttribute('data-bind', 'other.keypath');

      spyOn(Binding.prototype, 'bind').andCallThrough();
      parser.parse();

      expect(Binding.prototype.bind.callCount).toBe(2);
    });

  });

  describe('Binding', function() {
    var input;
    var prop;

    beforeEach(function() {
      Keypath.empty();

      input = document.createElement('input');
      input.setAttribute('data-bind', 'keypath');
      prop = Keypath.lookup('keypath');
    });

    it('should bind the node to JS property changes', function() {
      var parser = new Parser(input);
      parser.parse();

      expect(input.value).toBe('');
      prop.set('test');
      expect(input.value).toBe('test');
    });

    it('should bind the JS properties to node changes', function() {
      var parser = new Parser(input);
      parser.parse();

      expect(prop.get()).toBeUndefined();

      input.value = 10;
      evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, true);
      input.dispatchEvent(evt);

      expect(prop.get()).toBe('10');
    });

    it('should bind the node to computer properties', function() {
      var dep = new Property(['hello', 'world']);
      var get = function() { return dep.get().join(' '); };
      var computedKey = new Keypath('keypath', new ComputedProperty(get));

      var parser = new Parser(input);
      parser.parse();

      expect(input.value).toBe('hello world');
    });

    it('should not try and set computer properties', function() {
      var dep = new Property(['hello', 'world']);
      var get = function() { return dep.get().join(' '); };
      var computedKey = new Keypath('keypath', new ComputedProperty(get));

      var parser = new Parser(input);
      parser.parse();

      input.value = 10;
      evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, true);
      input.dispatchEvent(evt);

      expect(prop.get()).toBeUndefined();
    });

  });

});
