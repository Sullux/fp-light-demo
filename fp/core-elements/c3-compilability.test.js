Object.assign(globalThis, require('@sullux/fp-light'))

// the compilable function: the foundation for composability
// turns a function into a 2-step process:
// * the first call compiles it and returns a resolver
// * the second call runs the resolver

;(async () => {
  // make a 2-step function:
  const add = compilable((x, y) => x + y)
  console.log(add(40, 2)) // prints [function (anonymous)]

  // that didn't give us an answer because all we did is compile it
  // next we have to run it!!!
  const add40and2 = add(40, 2)
  console.log(add40and2()) // prints 42

  // this is stupid; why would we do this?
  // because you don't have to pass numbers!!!
  // the compile step will resolve your args which means you can pass functions
  const addXandY = add(_.x, _.y)
  console.log(addXandY({ x: 40, y: 2 })) // prints 42

  // ok, more useful, but still an extra step
  // so let's go back to our old friend map
  const numbers = [{ x: 1, y: 2 }, { x: 40, y: 2 }, { x: 1100, y: 38 }]
  const added = numbers.map(add(_.x, _.y))
  console.log(added) // prints [3, 42, 1138]

  // what if I want to do something obvious like just add 1?
  // no problem! if you skip the last arg, the compiled function will assum _
  // so this:
  add(1, _)
  // is the same as this:
  add(1)
  // which means we can do some nice clean number mapping
  const plainNumbers = [1, 2, 3]
  const incrementedNumbers = plainNumbers.map(add(1))
  console.log(incrementedNumbers) // prints [2, 3, 4]

  // is there a way to skip the compile step and just pass it some numbers?
  // yes! every compilable function has a $ property
  // the $ points to the original function implementation
  console.log(add.$(1, 2)) // prints 3

  // and remember that we get the same promise resolution out of the box
  // our compilable add function will resolve promises for us!
  const messyNumbers = [
    { x: 1, y: Promise.resolve(2) },
    { x: 40, y: 2 },
    Promise.resolve({ x: 1100, y: 38 }),
  ]
  const addedPromises = messyNumbers.map(add(_.x, _.y))
  console.log(await Promise.all(addedPromises)) // prints [3, 42, 1138]

  // what if I want my compilable to accept a function _without_ resolving it?
  // answer: there are some optional properties to compilable
  const map = compilable(
    (mapper, array) => array.map(mapper),
    { skip: 1 },
  )
  const addAllXsAndYs = map(add(_.x, _.y))
  console.log(addAllXsAndYs(numbers)) // prints [3, 42, 1138]

  // we are now starting to see some of the composability of the library
  // let's take a quick sidestep into string interpolation before we dive deeper
})()

describe('compilable', () => {
  it('should provide a passthrough of the original function', () => {
    // todo
  })
})
