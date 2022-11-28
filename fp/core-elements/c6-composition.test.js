Object.assign(globalThis, require('@sullux/fp-light'))

const logging = async () => {
  // so far we've been running a lot of one-off functions
  // it's time to start putting them together
  // introducing: the pipe
  const thisIsAFunction = pipe()
  console.log(thisIsAFunction(42)) // prints 42

  // a pipe is a function composed of a list of functions
  // when a value is passed to the pipe, it gets passed to the first function
  // the result of that function gets passed to the second function, etc.
  // the final function result gets returned from the pipe
  const incrementAndDouble = pipe(
    (x) => x + 1, // receives 20, returns 21
    (x) => x * 2, // receives 21, returns 42
  )
  console.log(incrementAndDouble(20)) // prints 42

  // let's do the same thing, but this time lets compose with some compilables
  const incAndDoub = pipe(
    add(1),
    mul(2),
  )
  console.log(incAndDoub(20)) // prints 42

  // let's play with the groupBy function too
  const groupableData = [
    { x: 1, y: 'foo' },
    { x: 1, y: 'bar' },
    { x: 2, y: 'x' },
    { x: 2, y: 'y' },
    { x: 2, y: 'z' },
  ]
  const key = _[0]
  const value = _[1]
  const yValuesPerX = pipe(
    groupBy(_.x),
    map([key, map(_.y, value)]),
    toObject,
  )
  console.log(yValuesPerX(groupableData))
  // prints { '1': [ 'foo', 'bar' ], '2': [ 'x', 'y', 'z' ] }

  // just like the map function, pipes maintain absolute order of operations
  const orderedOperations = pipe(
    tap(() => console.log('starting')),
    add(1),
    delay(10),
    tap(() => console.log('waited 10')),
    mul(2),
    tap(() => console.log('done')),
  )
  console.log(await orderedOperations(20)) // prints 42
  // starting
  // waited 10
  // done

  // lets take a look at tracing now
  const failingPipe = pipe(
    add(1),
    failWith(Error, 'reasons'),
    mul(2),
  )
  failingPipe(20).catch(console.log)
  // ------------ without tracing ------------
  /*
    reasons

      63 |     mul(2),
      64 |   )
    > 65 |   failingPipe(20).catch(console.log)
         |   ^
      66 | }
      67 |
      68 | describe('composition', () => {

      at Number.failWith (node_modules/@sullux/fp-light/index.js:1318:13)
      at Object.apply (node_modules/@sullux/fp-light/index.js:965:17)
      at Object.apply (node_modules/@sullux/fp-light/index.js:829:13)
      at node_modules/@sullux/fp-light/index.js:2027:15
          at Array.reduce (<anonymous>)
      at failingPipe (node_modules/@sullux/fp-light/index.js:2023:23)
      at Object.logging (fp/core-elements/c6-composition.test.js:65:3)
  */
  // ------------ with FP_LIGHT_TRACE=on ------------
  /*
    reasons
        from 8:__FP_LIGHT_PROPERTY_FUNCTION__ targetPropertyIfExists()<STEP_2> (/home/mistify/mistify/md/fp/core-elements/c6-composition.test.js:65:3)
        from pipe (/home/mistify/mistify/md/fp/core-elements/c6-composition.test.js:60:23)

      63 |     mul(2),
      64 |   )
    > 65 |   failingPipe(20).catch(console.log)
         |   ^
      66 | }
      67 |
      68 | describe('composition', () => {

      at Object.logging (fp/core-elements/c6-composition.test.js:65:3)
  */
}

describe('composition', () => {
  it('should log all the things', logging)
})
