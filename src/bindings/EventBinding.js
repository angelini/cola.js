define([
  'Property'
],

function(Property) {

  function EventBinding(node, bindName, context) {
    var nameSplit = bindName.split(':');

    if (nameSplit.length != 2) {
      throw new Error('Invalid data-event binding');
    }

    this.node      = node;
    this.eventName = nameSplit[0];
    this.handler   = context.lookup(nameSplit[1]);
  }

  EventBinding.ATTRIBUTE = 'data-event';

  EventBinding.prototype.bind = function() {
    this.node.addEventListener(this.eventName, this.callHandler.bind(this));
  };

  EventBinding.prototype.callHandler = function(event) {
    if (Property.isProperty(this.handler)) {
      this.handler.get()(this.node, event);
    } else {
      this.handler(this.node, event);
    }
  };

  return EventBinding;

});
