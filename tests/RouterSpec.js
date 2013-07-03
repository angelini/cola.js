define([
  'src/RouteNode',
  'src/RouteTree',
  'src/Router'
],

function(RouteNode, RouteTree, Router) {

  describe('RouteNode', function() {
    var root;

    beforeEach(function() {
      root = new RouteNode();
    });

    it('should find the child node with the same name', function() {
      var first = new RouteNode('first');
      var second = new RouteNode('second');

      root.children.push(first, second);

      expect(root.findChild('first')).toBe(first);
      expect(root.findChild('second')).toBe(second);
    });

    it('should return the __argument__ child if the option is included', function() {
      var first = new RouteNode('first');
      var argument = new RouteNode('__argument__');

      root.children.push(first, argument);

      expect(root.findChild('none')).toBeUndefined();
      expect(root.findChild('none', {includeArguments: true})).toBe(argument);
    });

  });

  describe('RouteTree', function() {
    var tree;

    beforeEach(function() {
      tree = new RouteTree();
    });

    it('should match a route to it\'s function', function() {
      tree.define('/test/foo', 1);
      tree.define('/test/foo/bar', 2);
      tree.define('/foo/bar', 3);

      expect(tree.match('/test/foo').fn).toBe(1);
      expect(tree.match('/test/foo/bar').fn).toBe(2);
      expect(tree.match('/foo/bar').fn).toBe(3);
      expect(tree.match('/test/none')).toBeUndefined();
    });

    it('should handle routes with arguments', function() {
      tree.define('/test/:foo', 1);
      tree.define('/test/:foo/:bar', 2);
      tree.define('/:foo/bar', 3);

      firstMatch = tree.match('/test/hello');
      secondMatch = tree.match('/test/world/hello');
      thirdMatch = tree.match('/bar/bar');

      expect(firstMatch.fn).toBe(1);
      expect(firstMatch.args).toEqual({foo: 'hello'});

      expect(secondMatch.fn).toBe(2);
      expect(secondMatch.args).toEqual({foo: 'world', bar: 'hello'});

      expect(thirdMatch.fn).toBe(3);
      expect(thirdMatch.args).toEqual({foo: 'bar'});
    });

  });

  describe('Router', function() {
    var routeCb;

    beforeEach(function() {
      routeCb = jasmine.createSpy('routeCb');
      Router.empty();
    });

    it('should call a match\'s callback', function() {
      Router.addRoute('/test/foo', routeCb);
      expect(routeCb).not.toHaveBeenCalled();

      Router.route('/test/foo');
      expect(routeCb).toHaveBeenCalledWith('/test/foo', {}, {});
    });

    it('should callback with the route\'s params', function() {
      Router.addRoute('/test/:first/:second', routeCb);
      Router.route('/test/arg/other');

      expect(routeCb).toHaveBeenCalledWith('/test/arg/other', {
        first: 'arg',
        second: 'other'
      }, {});
    });

    it('should callback with query paramters', function() {
      Router.addRoute('/test', routeCb);
      Router.route('/test?hello=world&test=first');

      expect(routeCb).toHaveBeenCalledWith('/test?hello=world&test=first', {}, {
        hello: 'world',
        test: 'first'
      });
    });

    it('should handle empty query strings', function() {
      Router.addRoute('/test', routeCb);
      Router.route('/test?hey=&other=value');

      expect(routeCb).toHaveBeenCalledWith('/test?hey=&other=value', {}, {
        hey: '',
        other: 'value'
      });
    });

  });

});
