define([],

function() {

  function RouteNode(name) {
    this.name = name;
    this.children = [];
  }

  RouteNode.prototype.findChild = function(name, options) {
    options = options || {};

    var node = _.find(this.children, function(childNode) {
      return childNode.name == name;
    });

    if (!node && options.includeArguments) {
      node = this.findChild('__argument__');
    }

    return node;
  };

  return RouteNode;

});
