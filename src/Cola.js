define([
 'PropertyStack',
 'Property',
 'ComputedProperty',

 'Context',
 'Binding',
 'Parser',

 'Router'
],

function(PropertyStack, Property, ComputedProperty, Context, Binding, Parser, Router) {

  var Cola = {};

  Cola.PropertyStack    = PropertyStack;
  Cola.Property         = Property;
  Cola.ComputedProperty = ComputedProperty;

  Cola.Context          = Context;
  Cola.Binding          = Binding;
  Cola.Parser           = Parser;

  Cola.Router           = Router;

  return Cola;

});
