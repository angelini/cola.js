define([
  'RouteTree'
],

function(RouteTree) {

  function Router() {
    this.tree = new RouteTree();
  }

  Router.prototype.addRoute = function(definition, fn) {
    this.tree.define(definition, fn);
  };

  Router.prototype.route = function(fullPath) {
    var pathSplit = fullPath.split('?'),
        path = pathSplit[0],
        query = {},
        match = this.tree.match(path);

    if (!match) {
      return;
    }

    if (pathSplit.length == 2) {
      query = this.buildQueryObject(pathSplit[1]);
    }

    match.fn(fullPath, match.args, query);
  };

  Router.prototype.empty = function() {
    this.tree = new RouteTree();
  };

  Router.prototype.buildQueryObject = function(queryString) {
    var query = {},
        querySplit = queryString.split('&');

    _.each(querySplit, function(param) {
      var paramSplit = param.split('=');
      query[paramSplit[0]] = paramSplit.length == 2 ? paramSplit[1] : '';
    });

    return query;
  };

  return Router;

});
