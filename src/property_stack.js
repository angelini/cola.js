function PropertyStack() {
  this.array = [];
}

PropertyStack.prototype.push = function(value) { this.array.push(value); };

PropertyStack.prototype.pop = function() { return this.array.pop(); };

PropertyStack.prototype.length = function() { return this.array.length; };

PropertyStack.prototype.peek = function() { return this.array[this.array.length - 1]; };

PropertyStack.prototype.addDependency = function(property) {
  if (this.array.length === 0) return;

  var parent = this.peek();
  parent.addDependency(property);
};

module.exports = new PropertyStack();
