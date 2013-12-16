define([
  'Property',
  'Context'
],

function(Property, Context) {

  describe('Context', function() {

    it('should read through mixed Property and native objects', function() {
      var test    = { inner: new Property({foo: 1}) },
          context = new Context({test: test});

      expect(context.lookup('test')).toBe(test);
      expect(context.lookup('test.inner').get()).toEqual({foo: 1});
      expect(context.lookup('test.inner.foo')).toBe(1);
    });

    it('should allow adding through object or key value', function() {
      var data    = { a: 1, b: 2 },
          context = new Context(data);

      context.add({ b: 3, c: 4});
      expect(context.lookup('a')).toBe(1);
      expect(context.lookup('b')).toBe(3);
      expect(context.lookup('c')).toBe(4);

      context.add('c', 5);
      context.add('d', 6);
      expect(context.lookup('a')).toBe(1);
      expect(context.lookup('c')).toBe(5);
      expect(context.lookup('d')).toBe(6);
    });

    it('should extend to a new Context with itself as parent', function() {
      var data     = { a: 1, b: 2 },
          child    = { b: 3, c: 4 },
          context  = new Context(data),
          extended = context.extend(child);

      expect(context.data).toBe(data);
      expect(extended.parent).toBe(context);
      expect(extended.data).toBe(child);
    });

    it('should lookup through parent Contexts', function() {
      var data     = { a: 1, b: 2 },
          child    = { b: 3, c: 4 },
          context  = new Context(data),
          extended = context.extend(child);

      expect(context.lookup('b')).toBe(2);
      expect(extended.lookup('b')).toBe(3);
      expect(extended.lookup('a')).toBe(1);
    });

  });

});
