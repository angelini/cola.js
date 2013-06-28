describe('Router', function() {
  var routeCb;

  beforeEach(function() {
    routeCb = jasmine.createSpy('routeCb');
    Cola.Router.empty();
  });

  it('should call a perfect match\'s callback', function() {
    Cola.Router.addRoute('/test/foo', routeCb);
    expect(routeCb).not.toHaveBeenCalled();

    Cola.Router.route('/test/foo');
    expect(routeCb).toHaveBeenCalledWith('/test/foo', {}, {});
  });

  it('should callback with route params', function() {
    Cola.Router.addRoute('/test/:first/:second', routeCb);
    Cola.Router.route('/test/arg/other');

    expect(routeCb).toHaveBeenCalledWith('/test/arg/other', {
      first: 'arg',
      second: 'other'
    }, {});
  });

  it('should callback with query paramters', function() {
    Cola.Router.addRoute('/test', routeCb);
    Cola.Router.route('/test?hello=world&test=first');

    expect(routeCb).toHaveBeenCalledWith('/test?hello=world&test=first', {}, {
      hello: 'world',
      test: 'first'
    });
  });

  it('should handle empty query strings', function() {
    Cola.Router.addRoute('/test', routeCb);
    Cola.Router.route('/test?hey=&other=value');

    expect(routeCb).toHaveBeenCalledWith('/test?hey=&other=value', {}, {
      hey: '',
      other: 'value'
    });
  });

});
