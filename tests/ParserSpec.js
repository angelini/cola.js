define([
  'Parser',
  'bindings/EventBinding',
  'bindings/ValueBinding',
  'bindings/IteratorBinding'
],

function(Parser, EventBinding, ValueBinding) {

  describe('Parser', function() {
    var div,
        iterator,
        context;

    beforeEach(function() {
      context = {};

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

      iterator = document.createElement('div');
      iterator.innerHTML = ['<ul>',
                            '  <li data-iterator="foo:bar">',
                            '    <p></p>',
                            '    <p></p>',
                            '  </li>',
                            '</ul>',
                            '<div>',
                            '  <p>',
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

    it('should skip parsing children when it parses a data-iterator node', function() {
        var parser = new Parser(iterator);
        spyOn(parser, 'nextNode').andCallThrough();

        parser.parse();

        expect(parser.nextNode.callCount).toBe(5);
    });

  });

});
