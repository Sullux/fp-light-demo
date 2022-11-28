Object.assign(globalThis, require('@sullux/fp-light'))

const factory = ({
  BUCKET_NAME,
  s3,
}) => {
  const saveToS3 = trap(pipe(
    {
      Bucket: BUCKET_NAME,
      Key: $`${_.name}@${_.version}`,
      Body: stringify,
    },
    s3.putObject,
    { etag: _.ETag, version: _.VersionID },
  ))

  return { saveToS3 }
}

describe('all together', () => {
  it('should save to s3', async () => {
    const BUCKET_NAME = 'my-bucket'
    const object = {
      name: 'my-object',
      version: '1.0.0',
      data: {},
    }
    const result = { etag: '1234', version: 'abcd' }
    const s3 = {
      putObject: jest.fn((params) => {
        expect(params).toEqual({
          Bucket: BUCKET_NAME,
          Key: 'my-object@1.0.0',
          Body: stringify(object),
        })
        return Promise.resolve({ ETag: result.etag, VersionID: result.version })
      }),
    }
    const { saveToS3 } = factory({
      BUCKET_NAME,
      s3,
    })
    const actual = await saveToS3(object)
    expect(actual).toEqual([undefined, result])
  })

  it('should return an error', async () => {
    const BUCKET_NAME = 'my-bucket'
    const object = {
      name: 'my-object',
      version: '1.0.0',
      data: {},
    }
    const err = new Error('reasons')
    const s3 = {
      putObject: jest.fn(() => Promise.reject(err)),
    }
    const { saveToS3 } = factory({
      BUCKET_NAME,
      s3,
    })
    const actual = await saveToS3(object)
    expect(actual).toEqual([err])
  })
})
