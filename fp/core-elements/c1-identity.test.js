Object.assign(globalThis, require('@sullux/fp-light'))

// the magical underscore
// inspired by an operator in Scala
// represents the argument that was passed to the function

;(() => {
  // this is basically how the underscore is defined:
  let _ = (v) => v
  console.log(_(42)) // prints 42

  // what use is that???
  // well, for starters, we could filter out falsy entries from an array
  const mixed = [1, 2, null, 3]
  const truthyOnes = mixed.filter(_)
  console.log(truthyOnes) // prints [1, 2, 3]

  // but the real underscore can do _sooo_ much more...
  _ = globalThis._ // lets get our original one back to see some examples...
  // when we access a property of the underscore, we get a whole new function
  const getFoo = _.foo

  // what does this function do? when we pass it an object, it gets `foo`
  console.log(getFoo({ foo: 'bar' })) // prints bar

  // where might we use that?
  // we could map out a single property of each object in an array
  const objects = [{ x: 1 }, { x: 2 }, { x: 3 }]
  const onlyX = objects.map(_.x)
  console.log(onlyX) // prints [1, 2, 3]

  // it can also access array elements
  const pairs = Object.entries({ x: 1, y: 2, z: 3 })
  const onlyValues = pairs.map(_[1])
  console.log(onlyValues) // prints [1, 2, 3]

  // and it can get to nested elements
  const prop = 'bar'
  const getNestedValue = _[1].foo[prop]
  const nested = getNestedValue([null, { foo: { bar: 42 } }])
  console.log(nested) // prints 42

  // it can even resolve a property name dynamically
  const getSomething = _[_.prop]
  const gotSomething = getSomething({ prop: 'foo', foo: 42 })
  console.log(gotSomething) // prints 42
})()

describe('identity', () => {
  it('should alias _', () => expect(_).toBe(identity))

  it('should return the argument verbatim', () => {
    expect(_(42)).toBe(42)
  })

  it('should return a property of an object', () => {
    expect(_.x({ x: 42 })).toBe(42)
  })

  it('should return an element of an array', () => {
    expect(_[1]([null, 42])).toBe(42)
  })

  it('should return a nested property', () => {
    expect(_.foo.bar({ foo: { bar: 42 } })).toBe(42)
  })

  it('should return a nested array element', () => {
    expect(_[1].foo[0]([null, { foo: [42, 'bar'] }])).toBe(42)
  })

  it('should resolve a property name dynamically', () => {
    expect(_[_.prop]({ prop: 'foo', foo: 42 })).toBe(42)
  })
})
