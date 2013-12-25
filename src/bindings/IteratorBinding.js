define([
  'underscore',
  'require',

  'Property',
  'List',
  'Parser'
],

function(_, require, Property, List, Parser) {

  function IteratorBinding(node, bindName, context) {
    var nameSplit = bindName.split(':');

    if (nameSplit.length != 2) {
      throw new Error('Invalid data-iterator binding');
    }

    this.node      = node;
    this.context   = context;
    this.items     = context.lookup(nameSplit[1]);

    this.iterationName = nameSplit[0];
    this.iterations    = [this.node];
    this.commentNode   = document.createComment('data-iterator-' + nameSplit[1]);

    this.node.removeAttribute(IteratorBinding.ATTRIBUTE);
    this.parent = this.node.parentElement;
    this.clone  = node.cloneNode(true);
  }

  IteratorBinding.ATTRIBUTE = 'data-iterator';
  IteratorBinding.SKIP_CHILDREN = true;

  IteratorBinding.prototype.bind = function() {
    var self = this;

    this.parent.insertBefore(this.commentNode, this.node.nexElementSibling);

    if (Property.isProperty(this.items)) {
      this.items.on('change', this.createIterations.bind(this));
    }

    if (List.isList(this.items)) {
      this.items.on('update', this.update.bind(this));

      this.items.on('add', function(newVals, indexes) {
        _.each(newVals, function(newVal, iterationIndex) {
          self.add(newVal, indexes[iterationIndex]);
        });
      });

      this.items.on('remove', function(oldVals, indexes) {
        self.remove(indexes);
      });
    }

    this.createIterations();

    return this.commentNode;
  };

  IteratorBinding.prototype.createIterations = function() {
    var items,
        self = this;

    if (Property.isProperty(this.items) || List.isList(this.items)) {
      items = this.items.get();
    } else {
      items = this.items;
    }

    if (!items) return;

    _.each(items, function(element, index) {
      if (self.iterations[index]) {
        self.update(element, index);
      } else {
        self.add(element, index);
      }
    });

    var extraCount = this.iterations.length - items.length;
    if (extraCount > 0) {
      this.remove(_.range(items.length, items.length + extraCount));
    }
  };

  IteratorBinding.prototype.update = function(element, index) {
    var newContext = {},
        newNode    = this.iterations[index],
        parser     = new (require('Parser'))(newNode);

    newContext[this.iterationName] = element;
    parser.parse(this.context.extend(newContext));
  };

  IteratorBinding.prototype.add = function(element, index) {
    var newContext = {},
        newNode    = this.clone.cloneNode(true),
        parser     = new (require('Parser'))(newNode);

    this.iterations.splice(index, 0, newNode);

    newContext[this.iterationName] = element;
    parser.parse(this.context.extend(newContext));

    var before = this.iterations[index + 1] || this.commentNode;
    this.parent.insertBefore(newNode, before);
  };

  IteratorBinding.prototype.remove = function(indexes) {
    this.iterations = _.reject(this.iterations, function(node, index) {
      if (indexes.indexOf(index) >= 0) {
        node.remove();
        return true;
      }
    });
  };

  return IteratorBinding;

});
