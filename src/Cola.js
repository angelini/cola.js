define([
  'underscore',
  'eventemitter2',
  'Utils',

  'PropertyStack',
  'Property',
  'ComputedProperty',
  'List',
  'MappedList',

  'Context',
  'bindings/ValueBinding',
  'bindings/EventBinding',
  'Parser',

  'Router'
],

function(_, EventEmitter, Utils, PropertyStack, Property, ComputedProperty,
         List, MappedList, Context, ValueBinding, EventBinding, Parser, Router) {

  var Cola = {};

  Cola._                = _;
  Cola.EventEmitter     = EventEmitter;
  Cola.Utils            = Utils;

  Cola.PropertyStack    = PropertyStack;
  Cola.Property         = Property;
  Cola.ComputedProperty = ComputedProperty;
  Cola.List             = List;
  Cola.MappedList       = MappedList;

  Cola.Context          = Context;
  Cola.ValueBinding     = ValueBinding;
  Cola.EventBinding     = EventBinding;
  Cola.Parser           = Parser;

  Cola.Router           = Router;

  return Cola;

});
