window._              = require('underscore');
window.ever           = require('ever');

window.Cola = {};

Cola.PropertyStack    = require('./src/property_stack');
Cola.Property         = require('./src/property');
Cola.ComputedProperty = require('./src/computed_property');

Cola.Keypath          = require('./src/keypath');
Cola.Binding          = require('./src/binding');
Cola.Parser           = require('./src/parser');

Cola.Router           = require('./src/router');
