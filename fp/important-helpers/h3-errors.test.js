Object.assign(globalThis, require('@sullux/fp-light'))

const log = console.log

const logging = async () => {
  // there are three sides to errors: defining, throwing, and handling

  // DEFINING ERRORS

  const MyError = defineError(
    'MyError', // name
    'ERR_MY', // code
    resolve({ message: _, timestamp: Date.now }),
  )

  try {
    throw MyError('reasons')
  } catch (err) {
    log(err.name) // prints 'MyError'
    log(err.code) // prints 'ERR_MY'
    log(err.message) // prints 'reasons'
    log(err.timestamp) // prints 1669662569790
  }

  const MultiArgError = defineError(
    'MultiArgError',
    'ERR_MULTI_ARG',
    (message, description) => ({ message, description }),
  )

  try {
    throw new MultiArgError('reasons', 'descripton of reasons')
  } catch (err) {
    log(err.name) // prints 'MultiArgError'
    log(err.code) // prints 'ERR_MULTI_ARG'
    log(err.message) // prints 'reasons'
    log(err.description) // prints 'descripton of reasons'
  }

  // THROWING ERRORS

  try {
    MyError.throw('reasons')
  } catch (err) {
    console.log(err.message) // prints 'reasons'
  }

  try {
    await MyError.reject('async reasons')
  } catch (err) {
    console.log(err.message) // prints 'async reasons'
  }

  const brokenPipe = pipe(
    add(1),
    failWith(MultiArgError, 'failed to add and increment', $`last value ${_}`),
    mul(2),
  )
  try {
    brokenPipe(20)
  } catch (err) {
    log(err.message) // prints 'failed to add and increment'
    log(err.description) // prints 'last value 21'
  }

  // HANDLING ERRORS

  // the trap function is the primary way to handle errors
  const err = _[0]
  const result = _[1]
  const safePipe = pipe(
    trap(brokenPipe),
    when(err, 0, result),
  )
  log(safePipe(20)) // prints 0
}

describe('errors', () => {
  it('should log all the things', logging)
})
