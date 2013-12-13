define([
 'PropertyStack',
 'Property',
 'ComputedProperty',

 'Keypath',
 'Binding',
 'Parser',

 'Router'
],

function(PropertyStack, Property, ComputedProperty, Keypath, Binding, Parser, Router) {

  var Cola = {};

  Cola.PropertyStack    = PropertyStack;
  Cola.Property         = Property;
  Cola.ComputedProperty = ComputedProperty;

  Cola.Keypath          = Keypath;
  Cola.Binding          = Binding;
  Cola.Parser           = Parser;

  Cola.Router           = Router;

  return Cola;

});
