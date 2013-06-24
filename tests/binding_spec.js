describe('Keypath', function() {

  it('should keep a map of all keypaths', function() {
    var key = new Cola.Keypath('test', new Cola.Property('value'));
    var prop = Cola.Keypath.lookup('test');
    expect(prop.get()).toBe('value');
  });

  it('should create the property if the name is not in the map', function() {
    var prop = Cola.Keypath.lookup('not.present');
    expect(prop).toEqual(jasmine.any(Cola.Property));
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
    var parser = new Cola.Parser(div);
    spyOn(parser, 'nextNode').andCallThrough();

    parser.parse();

    expect(parser.nextNode.callCount).toBe(7);
  });

  it('should detect data-bind attributes', function() {
    var parser = new Cola.Parser(div);
    
    div.firstChild.setAttribute('data-bind', 'keypath');
    div.lastChild.firstElementChild.setAttribute('data-bind', 'other.keypath');

    spyOn(Cola.Binding.prototype, 'bind').andCallThrough();
    parser.parse();

    expect(Cola.Binding.prototype.bind.callCount).toBe(2);
  });

});

describe('Binding', function() {
  var div;
  var prop;

  beforeEach(function() {
    Cola.Keypath.empty();

    div = document.createElement('input');
    div.setAttribute('data-bind', 'keypath');
    prop = Cola.Keypath.lookup('keypath');
  });

  it('should bind the node to JS property changes', function() {
    var parser = new Cola.Parser(div);
    parser.parse();

    expect(div.value).toBe('');
    prop.set('test');
    expect(div.value).toBe('test');
  });

  it('should bind the JS properties to node changes', function() {
    var parser = new Cola.Parser(div);
    parser.parse();

    expect(prop.get()).toBeUndefined();

    div.value = 10;
    ever(div).emit('change');

    expect(prop.get()).toBe('10');
  });

});
