var mapleTree = require('mapleTree');

function Router() {
  var self = this;
  this.tree = new mapleTree.RouteTree();
}

Router.prototype.addRoute = function(definition, fn) {
  this.tree.define(definition, fn);
};

Router.prototype.route = function(fullPath) {
  var pathSplit = fullPath.split('?');
  var path = pathSplit[0];
  var query = {};
  var match = this.tree.match(path);

  if (!match || !match.perfect) {
    return;
  }

  if (pathSplit.length == 2) {
    query = this.buildQueryObject(pathSplit[1]);
  }

  match.fn(fullPath, match.params, query);
};

Router.prototype.empty = function() {
  this.tree = new mapleTree.RouteTree();
};

Router.prototype.buildQueryObject = function(queryString) {
  var query = {};
  var querySplit = queryString.split('&');

  _.each(querySplit, function(param) {
    var paramSplit = param.split('=');
    query[paramSplit[0]] = paramSplit.length == 2 ? paramSplit[1] : '';
  });

  return query;
};

module.exports = new Router();
