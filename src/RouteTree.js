define([
  'underscore'
],

function(_) {

  function RouteNode(name) {
    this.name = name;
    this.children = [];
  }

  RouteNode.prototype.hasChild = function(name, options) {
    options = options || {};

    var node = _.find(this.children, function(childNode) {
      return childNode.name == name;
    });

    if (!node && options.includeArguments) {
      node = this.hasChild('__argument__');
    }

    return node;
  };

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

      var childNode = currentNode.hasChild(routePiece);

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

      currentNode = currentNode.hasChild(routePiece, {includeArguments: true});

      if (currentNode && currentNode.name == '__argument__') {
        argumentList.push(routePiece);
      }
    });

    var args = {};

    _.each(currentNode.args, function(argumentName) {
      args[argumentName] = argumentList.shift();
    });

    return {fn: currentNode.fn, args: args};
  };

  return RouteTree;

});
