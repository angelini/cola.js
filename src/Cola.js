define([
  'Utils',

  'PropertyStack',
  'Property',
  'ComputedProperty',

  'Context',
  'bindings/ValueBinding',
  'bindings/EventBinding',
  'Parser',

  'Router'
],

function(Utils, PropertyStack, Property, ComputedProperty, Context,
         ValueBinding, EventBinding, Parser, Router) {

  var Cola = {};

  Cola.Utils            = Utils;

  Cola.PropertyStack    = PropertyStack;
  Cola.Property         = Property;
  Cola.ComputedProperty = ComputedProperty;

  Cola.Context          = Context;
  Cola.ValueBinding     = ValueBinding;
  Cola.EventBinding     = EventBinding;
  Cola.Parser           = Parser;

  Cola.Router           = Router;

  return Cola;

});
