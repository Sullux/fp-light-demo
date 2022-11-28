Object.assign(globalThis, require('@sullux/fp-light'))

const log = console.log

const logging = async () => {
  // we could spend hours on this, but here's a quick look

  // COMPARISON

  // the is function behaves like === with a couple of improvements
  log(is(42)(42)) // true
  log(is(42)('42')) // false
  log(is({})({})) // false
  log(is([])([])) // false
  log(is(NaN)(NaN)) // true

  // the equal function includes deep equality testing
  log(equal(42)(42)) // true
  log(equal(42)('42')) // false
  log(equal({})({})) // true
  log(equal({ foo: 42 })({ foo: 42 })) // true
  log(equal({ foo: 42 })({ foo: '42' })) // false
  log(equal({ log })({ log })) // true
  log(equal([])([])) // true
  log(equal(NaN)(NaN)) // true

  // some other comparison and related functions
  // typeName gives a consistent experience to type naming
  log(typeName(undefined)) // 'Undefined'
  log(typeName(null)) // 'Null'
  log(typeName('foo')) // 'String'
  log(typeName(42)) // 'Number'
  log(typeName({})) // 'Object'
  log(typeName([])) // 'Array'
  log(typeName(new Error('reasons'))) // 'Error'
  class MyError extends Error {}
  log(typeName(new MyError('reasons'))) // 'MyError'

  // type comparison is easy now with isType
  log(isType(Undefined)(undefined)) // true
  log(isType(Null)(null)) // true
  log(isType(Error)(new Error('reasons'))) // true
  log(isType(Error)(new MyError('reasons'))) // true

  // the isExactType function will not return true for extended types
  log(isExactType(Error)(new Error('reasons'))) // true
  log(isExactType(Error)(new MyError('reasons'))) // false

  // a bunch of other useful helpers:
  const helpers = [
    isUndefined,
    isNull,
    isDefined, // neither undefined nor null
    exists, // alias for isDefined
    isMissing, // either undefined or null
    notExists, // alias for isMissing
    isTruthy,
    isFalsy,
    isArray,
    isBoolean,
    isDate,
    isError,
    isFunction,
    isMap,
    isNumber,
    isObject, // strictly POJO!
    isSet,
    isString,
    isSymbol,
    isIterable,
  ]

  // how about the kind of compare you need to sort?
  // those types of comparisons return a number:
  //  -1 for less than, 0 for equal, or 1 for greater than
  log(compare('foo')('foo')) // 0
  log(compare('a')('b')) // -1
  log(compare('b')('a')) // 1
  log(compare(42)('a')) // -1
  log(compare({ foo: 'b' })({ foo: 'a' })) // 1
  log(compare({ foo: 'a' })({ foo: 'b' })) // -1
  log(compare({ foo: 'a' })({ foo: 'a' })) // 0
  const err1 = new Error('reasons')
  const err2 = new Error('reasons')
  log(compare(err1)(err2)) // 0
  err1.code = 'AAA'
  err2.code = 'BBB'
  log(compare(err1)(err2)) // -1

  // the comparer symbol is used to override default compare behavior
  class Point {
    constructor (x, y, name) {
      this.x = x
      this.y = y
      this.name = name
    }
  }
  // because it compares all properties by default, this prints 1
  log(compare(new Point(1, 4, 'z'))(new Point(1, 4, 'a')))
  // now we'll add a custom comparer to the prototype that only compares the
  //  point values and not the name
  class Point2 extends Point {}
  Point2.prototype[comparer] = compare([_.x, _.y], [_.x, _.y])
  // and with the custom comparer, this prints 0
  log(compare(new Point2(1, 4, 'z'))(new Point2(1, 4, 'a')))

  // comparing a subset of properties is a very common pattern, so we have the
  //  comparing helper for just this purpose:
  class Point3 extends Point {}
  Point3.prototype[comparer] = comparing([_.x, _.y])
  log(compare(new Point3(1, 4, 'z'))(new Point3(1, 4, 'a'))) // 0

  // it's also helpful for sorting
  const backwards = [{ x: 3 }, { x: 2 }, { x: 1 }]
  // long way
  // both of these print [{ x: 1 }, { x: 2 }, { x: 3 }]
  log(sort(compare([_.x, _.x]))(backwards))
  log(sort(comparing(_.x))(backwards))

  // VALIDATION

  // there are three functions: validate, assertValid and isValid
  // assertValid throws if there are any differences
  const obj1 = {
    foo: 'bar',
    baz: 42,
    biz: [1, 2, 3],
  }
  const obj2 = {
    foo: 'bar',
    baz: 21,
    biz: [1, 2],
  }
  try {
    assertValid(obj1)(obj2)
  } catch (err) {
    log(err.message)
    // Invalid input. 21 at .baz: v => equal.$... → false
    log(err.validator)
    // { foo: 'bar', baz: 42, biz: [ 1, 2, 3 ] }
    log(err.input)
    // { foo: 'bar', baz: 21, biz: [ 1, 2 ] }
    log(err.output) /*
      * 21 at .baz: v => equal.$... → false
      * undefined at .biz[2]: v => equal.$... → false
    */
  }

  // validate returns an array of differences
  log(validate(obj1)(obj2)) /*
    [
      [ '.baz', 21, [Function (anonymous)], false ],
      [ '.biz[2]', undefined, [Function (anonymous)], false ]
    ]
  */
  // a successful validation returns an empty array
  log(validate(isNumber)(42)) // []

  // isValid returns a boolean: false if there are differences; else true
  log(isValid(obj1)(obj2)) // false
  log(isValid(isNumber)(42)) // true

  // the validator supports complex cases including types and spread/rest args
  const validObj = isValid({
    foo: isString,
    bar: [isNumber, ...any],
    baz: { x: and(isString, gt(_.length, 2)) },
  })
  log(validObj({ foo: '', bar: [1, 'x'], baz: { x: 'abc' } })) // true
  log(validObj({ foo: null, bar: [1, 'x'], baz: { x: 'abc' } })) // false
  log(validObj({ foo: '', bar: [1, 'x'], baz: { x: 'abc', y: '' } })) // false
  log(validObj({ foo: '', bar: ['1', 'x'], baz: { x: 'abc' } })) // false
  // spreading the any helper in an object:
  log(isValid({ x: isNumber, ...any })({ x: 42, y: '' })) // true
  log(isValid({ x: isNumber, ...any })({ x: 42, y: '', z: 21 })) // true
  log(isValid({ x: isNumber, ...any })({ x: '42' })) // false
}

describe('compare and validate', () => {
  it('should log all the things', logging)
})
