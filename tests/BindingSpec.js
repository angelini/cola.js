define([
  'Property',
  'ComputedProperty',
  'List',
  'Parser',
  'Context',

  'bindings/ValueBinding',
  'bindings/EventBinding',
  'bindings/IteratorBinding'
],

function(Property, ComputedProperty, List, Parser, Context, ValueBinding, EventBinding, IteratorBinding) {

  describe('ValueBinding', function() {
    var input,
        prop,
        context;

    beforeEach(function() {
      prop    = new Property();
      context = {keypath: prop};
      input   = document.createElement('input');

      input.setAttribute('data-bind', 'keypath');
    });

    it('should bind the node to JS property changes', function() {
      var binding = new ValueBinding(input, 'keypath', new Context(context));
      binding.bind();

      expect(input.value).toBe('');
      prop.set('test');
      expect(input.value).toBe('test');
    });

    it('should bind the JS properties to node changes', function() {
      var binding = new ValueBinding(input, 'keypath', new Context(context));
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

      context = { keypath: new ComputedProperty(get) };

      var binding = new ValueBinding(input, 'keypath', new Context(context));
      binding.bind();

      expect(input.value).toBe('hello world');
    });

    it('should not try and set computed properties', function() {
      var dep = new Property(['hello', 'world']);
          get = function() { return dep.get().join(' '); };

      context = { keypath: new ComputedProperty(get) };

      var binding = new ValueBinding(input, 'keypath', new Context(context));
      binding.bind();

      input.value = 10;
      evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, true);
      input.dispatchEvent(evt);

      expect(context.keypath.get()).toBe('hello world');
    });

    it('should statically set non property attributes', function() {
      context.other = 10;

      var binding = new ValueBinding(input, 'other', new Context(context));
      binding.bind();

      expect(input.value).toBe('10');
      context.other = 20;
      expect(input.value).toBe('10');
    });

    it('should set a node\'s innerHTML if it\'s not editable', function() {
      var div     = document.createElement('div'),
          binding = new ValueBinding(div, 'keypath', new Context(context));

      binding.bind();

      expect(div.innerHTML).toBe('');
      prop.set('test');
      expect(div.innerHTML).toBe('test');
    });

  });

  describe('EventBinding', function() {
    var input,
        prop,
        context;

    beforeEach(function() {
      prop    = new Property();
      context = {};
      input   = document.createElement('input');


      input.setAttribute('data-bind', 'keypath');
    });

    it('should call the handler function when the event is fired', function() {
      var spy = jasmine.createSpy('spy');
      context = { keypath: spy };

      var binding = new EventBinding(input, 'change:keypath', new Context(context));
      binding.bind();

      evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, true);
      input.dispatchEvent(evt);

      expect(spy).toHaveBeenCalledWith(input, evt, context);
    });

    it('should call the handler function wrapped in a Property when the event is fired', function() {
      var spy = jasmine.createSpy('spy');
      context = { keypath: new Property(spy) };

      var binding = new EventBinding(input, 'change:keypath', new Context(context));
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

      context = { keypath: handlerProperty };

      var binding = new EventBinding(input, 'change:keypath', new Context(context));
      binding.bind();

      handlerProperty.set(calledSpy);

      evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, true);
      input.dispatchEvent(evt);

      expect(notCalledSpy.callCount).toBe(0);
      expect(calledSpy).toHaveBeenCalledWith(input, evt, context);
    });

  });

  describe('IteratorBinding', function() {
    var div;

    beforeEach(function() {
      div = document.createElement('div');
      div.innerHTML = ['<ul>',
                       '  <li data-iterator="elem:list">',
                       '    <p data-bind="elem"></p>',
                       '  </li>',
                       '</ul>',
                       '<div>',
                       '  <p>',
                       '</div>'
                      ].join('');
    });

    it('should give iteration an extended Context', function() {
      var ul      = div.firstElementChild,
          li      = ul.firstElementChild,
          list    = new Property([1, 2]),
          context = new Context({ list: list }),
          binding = new IteratorBinding(li, 'elem:list', context);

      binding.bind();

      expect(ul.children[0].context.parent).toBe(context);
      expect(ul.children[1].context.parent).toBe(context);

      expect(ul.children[0].context.lookup('elem')).toBe(1);
      expect(ul.children[1].context.lookup('elem')).toBe(2);
    });

    it('should add and remove children as it\'s source list changes', function() {
      var ul      = div.firstElementChild,
          li      = ul.firstElementChild,
          list    = new Property([]),
          binding = new IteratorBinding(li, 'elem:list', new Context({ list: list }));

      binding.bind();
      expect(ul.children.length).toBe(0);

      list.set([1, 2, 3]);
      expect(ul.children.length).toBe(3);

      expect(ul.querySelector('li:nth-child(1) p').innerHTML).toBe('1');
      expect(ul.querySelector('li:nth-child(2) p').innerHTML).toBe('2');
      expect(ul.querySelector('li:nth-child(3) p').innerHTML).toBe('3');

      list.set([1]);
      expect(ul.children.length).toBe(1);
    });

    it('should properly bind to a List object', function() {
      var ul      = div.firstElementChild,
          li      = ul.firstElementChild,
          list    = new List(),
          binding = new IteratorBinding(li, 'elem:list', new Context({ list: list }));

      binding.bind();
      expect(ul.children.length).toBe(0);

      list.push(1, 2, 3);
      expect(ul.children.length).toBe(3);

      expect(ul.querySelector('li:nth-child(1) p').innerHTML).toBe('1');
      expect(ul.querySelector('li:nth-child(2) p').innerHTML).toBe('2');
      expect(ul.querySelector('li:nth-child(3) p').innerHTML).toBe('3');

      list.set([1]);
      expect(ul.children.length).toBe(1);
    });

  });

});
