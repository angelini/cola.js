define([],

function() {

  var Utils = {};

  Utils.context = function(node) {
    while (node) {
      if (node.context) {
        return node.context;
      }

      node = node.parentNode;
    }
  };

  return Utils;

});
