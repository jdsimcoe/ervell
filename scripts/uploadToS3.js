/* eslint-disable no-console */

const chalk = require('chalk')

// @ts-check

require('../src/lib/loadEnv')

const glob = require('glob')
const mime = require('mime')
const path = require('path')
const s3 = require('s3')
const { last } = require('lodash')

const options = {
  root: 'public',
  files: path.join(process.cwd(), '/**/public/**'),
  key: process.env.S3_KEY,
  secret: process.env.S3_SECRET,
  bucket: process.env.S3_BUCKET,
  cdnUrl: process.env.CDN_URL,
}

// See: https://www.npmjs.com/package/s3 for more options
const client = s3.createClient({
  s3Options: {
    accessKeyId: options.key,
    secretAccessKey: options.secret,
  },
})

const files = glob.sync(options.files, {
  ignore: 'node_modules',
  nodir: true,
})

const generateHeaders = file => {
  const extension = path.extname(file)
  const contentType = mime.getType(extension)
  return {
    ACL: 'public-read',
    CacheControl: 'max-age=315360000, public',
    ContentType: contentType,
  }
}

console.log(chalk.green('[uploadToS3] Starting S3 sync...\n'))

files.forEach(file => {
  const s3Path = last(file.split(options.root)).substring(1)
  const uploader = client.uploadFile({
    localFile: file,

    // See: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
    s3Params: {
      Bucket: options.bucket,
      Key: s3Path,
      ...generateHeaders(file),
    },
  })

  uploader.on('error', err => {
    console.error(
      chalk.red(`[uploadToS3] Error uploading ${s3Path}.\n`),
      err.stack,
      '\n'
    )
  })

  uploader.on('end', () => {
    console.log(`[uploadToS3] ${s3Path}`)
  })
})
