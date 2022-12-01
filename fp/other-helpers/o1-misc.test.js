Object.assign(globalThis, require('@sullux/fp-light'))

const log = console.log

const logging = async () => {
  // Hash

  // hash an input buffer to an output buffer:
  log(hash(8, Buffer.from('foo'))) // <Buffer 79 1a 6e 0b 19 79 6c 0c>

  // hash anything to an output buffer:
  log(hashAny(8, { x: 1138, y: 'foo' })) // <Buffer 25 95 2c 4c 0a 7e 5d 52>

  // hash anything to other types of outputs:
  log(hashToString(16, { foo: 42 })) // XxY8B2vpnE1ufpkT
  log(hashToInt({ bar: 'baz' })) // -1119429034
  log(hashToDouble({ biz: 'buzz' })) // 1.3489999726027128e-239

  // Async
  // deepAwait: scan an object/array for promises and return the resolved object
  // awaitAny: given array of promises, returns the first resolved value
  // awaitAll: given array of promises, returns the array of resolved values
  // reject: given an error, throw the error asynchronously
  // asPromise: given a thennable, return a native Promise
  // isAsync (isPromise, isThennable) true if the value is a promise
  // toAsync (toPromise, toThennable): return the value asynchronously

  // Delay
  // awaitDelay: returns a promise that resolves after the given milliseconds
  // delay.$: given milliseconds and input, resolves the input after the delay
  pipe(
    tap(({ path, data }) => require('node:fs/promise').saveFile(path, data)),
    delay(10), // wait 10 milliseconds
    ({ path }) => require('node:fs/promise').readFile(path),
  )

  // Spread
  const fnWithArgs = (a, b, c) => log(a, b, c)
  pipe(
    [1, 2, 3],
    spread(fnWithArgs), // prints 1, 2, 3
  )()

  const doubleAll = toSpreadable((array) => array.map((v) => v * 2))
  pipe(
    [1, 2, 3],
    ['foo', ...doubleAll],
    log, // prints [ 'foo', 2, 4, 6 ]
  )()

  // Conversions
  log(toObject([['x', 1], ['y', 2]])) // prints { x: 1, y: 2 }
  log(toArray({ x: 1, y: 2 })) // prints [['x', 1], ['y', 2]]

  // Math
  pipe(
    add(_.x, _.y),
    sub(_.x, _.y),
    mul(_.x, _.y),
    div(_.x, _.y),
    mod(_.x, _.y),
    exp(_.x, _.y),
    pow(_.x, _.y),
    sqr(_.x),
    sqrt(_.x),
    isInteger(_.x),
    shift(_.x, _.y),
  )

  // Logic
  pipe(
    and(_.x, _.y, ..._.z),
    or(_.x, _.y, ..._.z),
    not(_.x),
  )

  // String Handling
  pipe(
    parse,
    stringify,
    padStart(_.len, _.char, _.str),
    padEnd(_.len, _.char, _.str),
    startsWith(_.value, _.str),
    endsWith(_.value, _.str),
    fromCharCode(_.bytes),
    fromCodePoint(_.bytes),
    charAt(_.index, _.str),
    charCodeAt(_.index, _.str),
    charPointAt(_.index, _.str),
    indexOf(_.value, _.str, _.fromIndex), // 3rd arg optional
    lastIndexOf(_.value, _.str, _.fromIndex), // 3rd arg optional
    toRegex([globalMatch, multiline], _.pattern),
  )
}

describe('other helpers', () => {
  it('should log all the things', logging)
})
