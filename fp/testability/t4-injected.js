// IMPLEMENTATION: injected
// FILE NAME: objectStore/objectStore.js
const objectStore = ({
  BUCKET_NAME,
  s3,
}) => ({
  saveObject: (key, object) =>
    s3.putObject({
      Bucket: BUCKET_NAME,
      Key: key,
      Data: JSON.stringify(object),
    }),

  getObject: () => {}, // etc.
})

module.exports = { objectStore }

// FILE NAME: objectStore/index.js
const { s3 } = require('@sullux/aws-sdk')()
const { BUCKET_NAME } = process.env
const { objectStore: objectStoreFactory } = require('./objectStore')

module.exports = objectStoreFactory({ BUCKET_NAME, s3 })
// USAGE: const { saveObject } = require('./objectStore')

// FILE NAME: objectStore/objectStore.test.js
describe('saveObject', () => {
  it('should send the object to s3', async () => {
    // we get to inject our mock now!
    const BUCKET_NAME = 'my-bucket'
    const object = { foo: 42 }
    const result = {}
    const s3 = {
      putObject: jest.fn((params) => {
        expect(params).toEqual({
          Bucket: BUCKET_NAME,
          Key: 'my-key',
          Data: JSON.stringify(object),
        })
        return Promise.resolve(result)
      }),
    }
    const { saveObject } = objectStoreFactory({
      BUCKET_NAME,
      s3,
    })
    const actual = await saveObject('my-key', object)
    expect(actual).toBe(result)
  })
})
