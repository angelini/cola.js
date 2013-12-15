define([
  'Property',
  'ComputedProperty',
  'Context',
  'Parser',
  'bindings/ValueBinding',
  'bindings/EventBinding'
],

function(Property, ComputedProperty, Context, Parser, ValueBinding, EventBinding) {

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
      var parser = new Parser(div);

      div.firstChild.setAttribute('data-bind', 'keypath');
      div.lastChild.firstElementChild.setAttribute('data-bind', 'other.keypath');

      spyOn(ValueBinding.prototype, 'bind');
      parser.parse(context);

      expect(ValueBinding.prototype.bind.callCount).toBe(2);
    });

    it('should detect data-event attributes', function() {
      var parser = new Parser(div);

      div.firstChild.setAttribute('data-event', 'change:keypath');
      div.lastChild.firstElementChild.setAttribute('data-event', 'submit:other.keypath');

      spyOn(EventBinding.prototype, 'bind');
      parser.parse(context);

      expect(EventBinding.prototype.bind.callCount).toBe(2);
    });

    it('should double bind a node with data-bind and data-event attributes', function() {
      var parser = new Parser(div);

      div.firstChild.setAttribute('data-bind', 'keypath');
      div.firstChild.setAttribute('data-event', 'change:keypath');

      spyOn(ValueBinding.prototype, 'bind');
      spyOn(EventBinding.prototype, 'bind');
      parser.parse(context);

      expect(ValueBinding.prototype.bind.callCount).toBe(1);
      expect(EventBinding.prototype.bind.callCount).toBe(1);
    });

  });

  describe('ValueBinding', function() {
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
      var binding = new ValueBinding(input, 'keypath', context);
      binding.bind();

      expect(input.value).toBe('');
      prop.set('test');
      expect(input.value).toBe('test');
    });

    it('should bind the JS properties to node changes', function() {
      var binding = new ValueBinding(input, 'keypath', context);
      binding.bind();

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

      var binding = new ValueBinding(input, 'keypath', context);
      binding.bind();

      expect(input.value).toBe('hello world');
    });

    it('should not try and set computed properties', function() {
      var dep = new Property(['hello', 'world']);
          get = function() { return dep.get().join(' '); };

      context.add({keypath: new ComputedProperty(get)});

      var binding = new ValueBinding(input, 'keypath', context);
      binding.bind();

      input.value = 10;
      evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, true);
      input.dispatchEvent(evt);

      expect(context.lookup('keypath').get()).toBe('hello world');
    });

    it('should statically set non property attributes', function() {
      var obj = {other: 10};
      context.add(obj);

      var binding = new ValueBinding(input, 'other', context);
      binding.bind();

      expect(input.value).toBe('10');
      obj.other = 20;
      expect(input.value).toBe('10');
    });

  });

  describe('EventBinding', function() {
    var input,
        prop,
        context;

    beforeEach(function() {
      prop    = new Property();
      context = new Context();
      input   = document.createElement('input');


      input.setAttribute('data-bind', 'keypath');
    });

    it('should call the handler function when the event is fired', function() {
      var spy = jasmine.createSpy('spy');
      context.add({keypath: spy});

      var binding = new EventBinding(input, 'change:keypath', context);
      binding.bind();

      evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, true);
      input.dispatchEvent(evt);

      expect(spy).toHaveBeenCalledWith(input, evt, context);
    });

    it('should call the handler function wrapped in a Property when the event is fired', function() {
      var spy = jasmine.createSpy('spy');
      context.add({keypath: new Property(spy)});

      var binding = new EventBinding(input, 'change:keypath', context);
      binding.bind();

      evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, true);
      input.dispatchEvent(evt);

      expect(spy).toHaveBeenCalledWith(input, evt, context);
    });

    it('should allow for Property handlers to be swapped out', function() {
      var notCalledSpy    = jasmine.createSpy('notCalledSpy'),
          calledSpy       = jasmine.createSpy('calledSpy'),
          handlerProperty = new Property(notCalledSpy);

      context.add({keypath: handlerProperty});

      var binding = new EventBinding(input, 'change:keypath', context);
      binding.bind();

      handlerProperty.set(calledSpy);

      evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, true);
      input.dispatchEvent(evt);

      expect(notCalledSpy.callCount).toBe(0);
      expect(calledSpy).toHaveBeenCalledWith(input, evt, context);
    });

  });

});
