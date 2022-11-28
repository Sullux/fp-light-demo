Object.assign(globalThis, require('@sullux/fp-light'))

// the resolve function: the foundation for the entire library
// I almost called it the "compile" function
// turns any value into a function

;(async () => {
  // turn a number into a function:
  const always42 = resolve(42)
  console.log(always42()) // prints 42

  // what can we do with this? not much
  // we can fill an array in an unnecessarily complicated way
  const uselessArray = Array(3).fill().map(resolve(42))
  console.log(uselessArray) // prints [42, 42, 42]

  // we can pass through something that's already a function a function:
  const alwaysPrints = resolve(() => console.log(42))
  alwaysPrints() // prints 42

  // not very useful so far, so let's add a feature:
  // when given an object, resolve will scan the object for functions
  // when the resolved function is called, it will in turn call the nested ones
  const anObjectWithFunctions = {
    foo: (input) => input.x,
    bar: (input) => input.y,
  }
  const theFunctionThatBuildsIt = resolve(anObjectWithFunctions)
  const theFinalResult = theFunctionThatBuildsIt({ x: 42, y: 'baz' })
  console.log(theFinalResult) // prints { foo: 42, bar: 'baz' }

  // wait a minute...can we use the underscore function instead of hand-typing?
  const anObjectWithUnderscores = {
    foo: _.x,
    bar: _.y,
  }
  const theSameBuilder = resolve(anObjectWithUnderscores)
  const theEasierResult = theSameBuilder({ x: 42, y: 'baz' })
  console.log(theEasierResult) // prints { foo: 42, bar: 'baz' }

  // neat trick, but it's cumbersome; where can we use this?
  // how about mapping?!
  const array = [{ x: 1 }, { x: 2 }, { x: 3 }]
  const mapped = array.map(resolve({
    input: _.x,
    doubled: ({ x }) => x * 2,
  }))
  console.log(mapped) // prints [{ input: 1, doubled: 2 }] etc.

  // ok, that's all well and good, but now it's time for some mind blowing:
  // the resolve function abstracts promises
  const messyArray = [1, Promise.resolve(2), 3]
  const mapWithPromises = messyArray.map(resolve({
    input: _,
  }))
  console.log(mapWithPromises) // prints [{ <Promise>, <Promise>, <Promise> }]
  console.log(await Promise.all(mapWithPromises)) // prints [{ input: 1 }] etc.

  // it resolves the inputs _before_ it calls the resolving functions
  const messyObject = { x: 40, y: Promise.resolve(2) }
  const sumOfXY = resolve(({ x, y }) => x + y)
  const result = await sumOfXY(messyObject)
  console.log(result) // prints 42

  // and it resolves the outputs _before_ it returns the final value
  const cleanObject = { x: 40, y: 2 }
  const messySum = resolve({
    asyncAnswer: ({ x, y }) => Promise.resolve(x + y),
    syncAnswer: 'no waiting',
  })
  const cleanResult = await messySum(cleanObject)
  console.log(cleanResult) // prints { asyncAnswer: 42, syncAnswer: 'no waiting' }
})()

describe('resolve', () => {
  it('should resolve a primitive value', () => {
    expect(resolve(42)()).toBe(42)
    expect(resolve('foo')()).toBe('foo')
  })

  it('should pass through a function', () => {
    const fn = () => 42
    expect(resolve(fn)()).toBe(42)
  })

  // todo...
})
