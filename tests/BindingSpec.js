define([
  'Property',
  'ComputedProperty',
  'Context',
  'Parser',
  'Binding'
],

function(Property, ComputedProperty, Context, Parser, Binding) {

  describe('Context', function() {

    it('should read through mixed Property and native objects', function() {
      var test    = { inner: new Property({foo: 1}) },
          context = new Context({test: test});

      expect(context.lookup('test')).toBe(test);
      expect(context.lookup('test.inner').get()).toEqual({foo: 1});
      expect(context.lookup('test.inner.foo')).toBe(1);
    });

  });

  describe('Parser', function() {
    var div,
        context;

    beforeEach(function() {
      context = new Context();

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
      var parser  = new Parser(div);

      div.firstChild.setAttribute('data-bind', 'keypath');
      div.lastChild.firstElementChild.setAttribute('data-bind', 'other.keypath');

      spyOn(Binding.prototype, 'bind').andCallThrough();
      parser.parse(context);

      expect(Binding.prototype.bind.callCount).toBe(2);
    });

  });

  describe('Binding', function() {
    var input,
        prop,
        context;

    beforeEach(function() {
      prop    = new Property();
      context = new Context({keypath: prop});
      input   = document.createElement('input');

      input.setAttribute('data-bind', 'keypath');
    });

    it('should bind the node to JS property changes', function() {
      var parser = new Parser(input);
      parser.parse(context);

      expect(input.value).toBe('');
      prop.set('test');
      expect(input.value).toBe('test');
    });

    it('should bind the JS properties to node changes', function() {
      var parser = new Parser(input);
      parser.parse(context);

      expect(prop.get()).toBeUndefined();

      input.value = 10;
      evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, true);
      input.dispatchEvent(evt);

      expect(prop.get()).toBe('10');
    });

    it('should bind the node to computed properties', function() {
      var dep = new Property(['hello', 'world']);
          get = function() { return dep.get().join(' '); };

      context.add({keypath: new ComputedProperty(get)});

      var parser = new Parser(input);
      parser.parse(context);

      expect(input.value).toBe('hello world');
    });

    it('should not try and set computed properties', function() {
      var dep = new Property(['hello', 'world']);
          get = function() { return dep.get().join(' '); };

      context.add({keypath: new ComputedProperty(get)});

      var parser = new Parser(input);
      parser.parse(context);

      input.value = 10;
      evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, true);
      input.dispatchEvent(evt);

      expect(context.lookup('keypath').get()).toBe('hello world');
    });

  });

});
