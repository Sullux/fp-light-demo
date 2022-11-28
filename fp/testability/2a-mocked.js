// IMPLEMENTATION: mocked
// FILE NAME: objectStore.js
const { s3 } = require('@sullux/aws-sdk')()
const { BUCKET_NAME } = process.env

const saveObject = (key, object) =>
  s3.putObject({
    Bucket: BUCKET_NAME,
    Key: key,
    Data: JSON.stringify(object),
  })

const getObject = () => {} // etc.

module.exports = { saveObject, getObject }
// USAGE: const { saveObject } = require('./objectStore')

// FILE NAME: objectStore.test.js
describe('saveObject', () => {
  it('should send the object to s3', async () => {
    // I guess we overwrite the original?
    const originalPutObject = s3.putObject
    const object = { foo: 42 }
    const result = {}
    s3.putObject = jest.fn((params) => {
      expect(params).toEqual({
        Bucket: process.env.BUCKET_NAME,
        Key: 'my-key',
        Data: JSON.stringify(object),
      })
      return Promise.resolve(result)
    })
    const actual = await saveObject('my-key', object)
    expect(actual).toBe(result)
    s3.putObject = originalPutObject
  })
})
