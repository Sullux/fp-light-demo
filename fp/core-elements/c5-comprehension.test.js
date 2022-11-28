Object.assign(globalThis, require('@sullux/fp-light'))

const logging = async () => {
  // we've been using the map function for a while now
  const numbers = [1, 2, 3]
  const objects = numbers.map((x) => ({ x }))
  console.log(objects) // prints [{ x: 1 }, { x: 2 }, { x: 3 }]

  // let's do the above, but with resolution
  // remember this?
  const stickItOnX = resolve({ x: _ })
  console.log(stickItOnX(42)) // prints { x: 42 }

  // we could use it in the map function if we wanted:
  const resolvedObjects = numbers.map(resolve({ x: _ }))
  console.log(resolvedObjects) // prints [{ x: 1 }, { x: 2 }, { x: 3 }]

  // that's getting a little bit ugly though; what if we create a map function?
  const toObjects = map({ x: _ })
  console.log(toObjects(numbers)) // prints [{ x: 1 }, { x: 2 }, { x: 3 }]

  // remember that just like compilables, comprehensions are a 2-step process
  // we could do it inline like this:
  console.log(map({ x: _ })(numbers)) // prints [{ x: 1 }, { x: 2 }, { x: 3 }]

  // do you remember how promises are resolved?
  // comprehension functions like map will resolve each step before proceeding
  // that means the steps will NOT run in parallel
  const longOperation = (ms) =>
    new Promise((resolve) => setTimeout(() => resolve(`${ms} ms`), ms))
  const results = await map(longOperation)([0, 10, 20])
  console.log(results) // prints ['0 ms', '10 ms', '20 ms']

  // can we do them all in parallel instead?
  // sure! but we'll need to log inside the operation to see what's happening
  // that's because the final order will always be the same as the input order
  const loggedOperation = (ms) => {
    const onComplete = (resolve) => () => {
      console.log('finished the', ms, 'ms operation')
      return resolve(`${ms} ms`)
    }
    return new Promise((resolve) => setTimeout(onComplete(resolve), ms))
  }
  const parallelResults = await parallel(loggedOperation)([20, 10, 0])
  // finished the 0 ms operation
  // finished the 10 ms operation
  // finished the 20 ms operation
  console.log(parallelResults) // prints ['20 ms', '10 ms', '0 ms']

  // how would that print if we used map instead of parallel?
  const mapResults = await map(loggedOperation)([20, 10, 0])
  // finished the 20 ms operation
  // finished the 10 ms operation
  // finished the 0 ms operation
  console.log(mapResults) // prints ['20 ms', '10 ms', '0 ms']

  // great! what other comprehension functions are there?
  console.log(filter(_)([1, 0, 2, 0])) // prints [1, 2]
  console.log(some(gt(0))([-1, 0, 1])) // prints true
  console.log(every(gt(0))([-1, 0, 1])) // prints false
  console.log(reverse(_)([1, 2, 3])) // prints [3, 2, 1]
  console.log(flat(_)([[1, 2], 3])) // prints [1, 2, 3]

  const backwards = objects.reverse() // [{ x: 3 }, { x: 2 }, { x: 1 }]
  const byX = comparing(_.x)
  console.log(sort(byX)(backwards)) // prints [{ x: 1 }, { x: 2 }, { x: 3 }]

  const groupableData = [
    { x: 1, y: 'foo' },
    { x: 1, y: 'bar' },
    { x: 2, y: 'x' },
    { x: 2, y: 'y' },
    { x: 2, y: 'z' },
  ]
  console.log(groupBy(_.x)(groupableData)) // prints:
  /*
    Map(2) {
      1 => [ { x: 1, y: 'foo' }, { x: 1, y: 'bar' } ],
      2 => [ { x: 2, y: 'x' }, { x: 2, y: 'y' }, { x: 2, y: 'z' } ]
    }
  */

  // we could spend an hour on the reduce function alone...
  const reduced = reduce({
    state: 0,
    reducer: add(_.state, _.value.x),
  })(backwards)
  console.log(reduced) // prints 6

  // and we could spend 2 hours on the join function
  const t1 = [{ x: 1, y: 'foo' }, { x: 1, y: 'bar' }, { x: 2, y: 'baz' }]
  const t2 = [{ index: 1, name: 'label' }]
  const joined = join({
    left: _.t1,
    right: _.t2,
    on: is(_.left.x, _.right.index),
    map: { x: _.left.x, name: _.right.name },
    outer: true,
  })({ t1, t2 })
  console.log(joined) // prints:
  /*
    [
      { x: 1, name: 'label' },
      { x: 1, name: 'label' },
      { x: 2, name: null }
    ]
  */
}

describe('comprehension', () => {
  it('should log all the things', logging)
})
