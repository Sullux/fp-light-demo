Object.assign(globalThis, require('@sullux/fp-light'))

const log = console.log
// just a mock:
const s3 = {
  getObject: () => Promise.resolve({ email: 'foo@example.com' }),
  putObject: () => Promise.resolve({ ETag: '1234' }),
}

const logging = async () => {
  // a side effect is a change of state
  // side effects include saving to a database, writing a disk file, or logging
  // a side effect may or may not return a value

  // for side effects that do not return a value (such as logging), the tap
  //  function creates a transparent pass-through
  const logged = tap(log)
  const foo = logged(42) // prints 42
  expect(foo).toBe(42)

  // a note about naming: we prefer to name side-effects in the past tense
  //  `logged`
  //  `savedToDisk`
  //  `enqueued`

  // for functions that return a value, we prefer to name the function by what
  //  it returns
  //  `userInfoFromS3` instead of `getUserInfoFromS3`
  //  `validatedData` instead of `validateData`

  const hash = (value) => hashToString(16, value)

  const userFromS3 = pipe(
    {
      Bucket: 'my-bucket',
      Key: _.userName,
    },
    s3.getObject,
  )

  const savedToS3 = tap(pipe(
    {
      Bucket: 'my-bucket',
      Key: _.userName,
      Body: stringify,
    },
    s3.putObject,
  ))

  const validatedUserInfo = pipe(
    assertValid({
      userName: and(isString, gt(_.length, 5)),
      ...any,
    }),
    {
      ..._,
      hash,
    },
  )

  const updatedUser = pipe(
    {
      newUserInfo: validatedUserInfo,
      existingUserInfo: userFromS3,
    },
    { ..._.existingUserInfo, ..._.newUserInfo },
    savedToS3, // update the info in S3
  )

  log(await updatedUser({ userName: 'sullux' }))
  /* prints:
    {
      email: 'foo@example.com',
      userName: 'sullux',
      hash: 'CwGkjg2rhn3nouNT'
    }
  */
}

describe('side effects', () => {
  it('should log all the things', logging)
})
