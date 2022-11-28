// Declarative vs imperative

const { s3 } = require('@sullux/aws-sdk')
const { BUCKET_NAME } = process.env

// Imperative

const saveToS3_ = async (event) => {
  const key = `${event.name}@${event.version}`
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: JSON.stringify(event),
  }
  try {
    const { ETag: etag, VersionID: version } = await s3.putObject(params)
    return [null, { etag, version }]
  } catch (err) {
    return [err]
  }
}

// Declarative

const saveToS3 = trap(pipe(
  {
    Bucket: BUCKET_NAME,
    Key: $`${_.name}@${_.version}`,
    Body: stringify,
  },
  s3.putObject,
  { etag: _.ETag, version: _.VersionID },
))

module.exports = { saveToS3, saveToS3_ }
