Object.assign(globalThis, require('@sullux/fp-light'))

const logging = async () => {
  // we've covered complex resolution, compilability, list comprehension, and
  //  function composition
  // now it's time for conditional expressions
  // we don't have a classic "if" statement, but we do have the ternary:
  const oneOrTheOther = when(
    (v) => v > 0,
    'positive',
    'negative',
  )
  console.log(oneOrTheOther(-42)) // prints 'negative'

  // ok, but remember that all of the arguments are resolved, so we can do:
  const absolute = when(
    lt(_, 0),
    mul(-1),
    _,
  )
  console.log(absolute(-42)) // prints 42
  console.log(absolute(42)) // prints 42

  // since we must always return a value, skipping the "else" just returns the
  //  original value
  const abs = when(
    lt(_, 0),
    mul(-1),
  )
  console.log(abs(-42)) // prints 42
  console.log(abs(42)) // prints 42

  // as with all compilables, the when function resolves async values as well
  // first some made up helpers:
  const isOnDisk = compilable((path) => Promise.resolve(false))
  const savedToDisk = compilable((path, data) => Promise.resolve(path))
  // now the actual function:
  const cached = when(
    not(isOnDisk(_.path)),
    savedToDisk(_.path, _.data),
    _.path,
  )
  // let's pass it a file:
  const file = { path: '/foo', data: Buffer.from('bar') }
  const pathAfterCaching = await cached(file)
  console.log(pathAfterCaching) // prints '/foo'

  // what if we have a chain of conditions and outcomes like a switch statement?
  const print = select(
    [isNumber(_), $`num: ${_}`],
    [isString(_), $`str: ${_}`],
    [isObject(_), $`obj: ${stringify}`],
  )
  console.log(print(42)) // prints num: 42
  console.log(print('foo')) // prints str: foo
  console.log(print({ foo: 42 })) // prints obj: { "foo": 42 }
}

describe('conditional', () => {
  it('should log all the things', logging)
})
