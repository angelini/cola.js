define([
  'underscore',
  'src/RouteNode'
],

function(_, RouteNode) {

  function RouteTree() {
    this.root = new RouteNode('');
  }

  RouteTree.prototype.normalizeRoute = function(route) {
    return (route.charAt(0) != '/') ? '/' + route : route;
  };

  RouteTree.prototype.define = function(route, fn) {
    route = this.normalizeRoute(route);

    var routePieces = route.split('/');
    var currentNode = this.root;
    var routeArgs = [];

    _.each(routePieces, function(routePiece, index) {
      if (index === 0) return;

      if (routePiece.charAt(0) == ':') {
        routeArgs.push(routePiece.substr(1));
        routePiece = '__argument__';
      }

      var childNode = currentNode.findChild(routePiece);

      if (!childNode) {
        childNode = new RouteNode(routePiece);
        currentNode.children.push(childNode);
      }

      if (index == routePieces.length - 1) {
        childNode.fn = fn;
        childNode.args = routeArgs;
      }

      currentNode = childNode;
    });
  };

  RouteTree.prototype.match = function(route) {
    route = this.normalizeRoute(route);

    var routePieces = route.split('/');
    var currentNode = this.root;
    var argumentList = [];

    _.each(routePieces, function(routePiece, index) {
      if (index === 0) return;
      if (!currentNode) return;

      currentNode = currentNode.findChild(routePiece, {includeArguments: true});

      if (currentNode && currentNode.name == '__argument__') {
        argumentList.push(routePiece);
      }
    });

    if (!currentNode) return;

    var args = {};

    _.each(currentNode.args, function(argumentName) {
      args[argumentName] = argumentList.shift();
    });

    return {fn: currentNode.fn, args: args};
  };

  return RouteTree;

});
