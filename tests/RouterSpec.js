define([
  'src/Router'
],

function(Router) {

  describe('Router', function() {
    var routeCb;

    beforeEach(function() {
      routeCb = jasmine.createSpy('routeCb');
      Router.empty();
    });

    it('should call a perfect match\'s callback', function() {
      Router.addRoute('/test/foo', routeCb);
      expect(routeCb).not.toHaveBeenCalled();

      Router.route('/test/foo');
      expect(routeCb).toHaveBeenCalledWith('/test/foo', {}, {});
    });

    it('should callback with route params', function() {
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
