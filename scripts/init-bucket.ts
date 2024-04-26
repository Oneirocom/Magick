import axios from 'axios'

const publicBase =
  process.env.NEXT_AWS_BUCKET_ENDPOINT || 'http://localhost:9090'
const publicName = process.env.NEXT_AWS_BUCKET_NAME || 'magick'

const projectBase =
  process.env.PROJECT_AWS_BUCKET_ENDPOINT || 'http://localhost:9090'
const projectName = process.env.PROJECT_AWS_BUCKET_NAME || 'magick-projects'

const publicBucketUrl = `${publicBase}/${publicName}`
const projectBucketUrl = `${projectBase}/${projectName}`

const createBucket = async (bucketUrl: string) => {
  try {
    const response = await axios.put(bucketUrl)
    console.log('Bucket created', response.data)
  } catch (error) {
    console.error('Error creating bucket:', error)
  }
}

const uploadFile = async (
  fileName: string,
  content: string,
  bucketUrl: string
) => {
  try {
    const response = await axios.put(`${bucketUrl}/${fileName}`, content, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
    console.log('File uploaded:', response.data)
  } catch (error) {
    console.error('Error uploading file:', error)
  }
}

const getFile = async (fileName: string, bucketUrl: string) => {
  try {
    const response = await axios.get(`${bucketUrl}/${fileName}`, {
      responseType: 'text',
    })
    console.log('File content:', response.data)
  } catch (error) {
    console.error('Error getting file:', error)
  }
}

const main = async () => {
  await createBucket(publicBucketUrl)
  await createBucket(projectBucketUrl)
  await uploadFile(
    'test-public.txt',
    'hello world: public bucket',
    publicBucketUrl
  )
  await uploadFile(
    'test-project.txt',
    'hello world: project bucket',
    projectBucketUrl
  )

  await getFile('test-public.txt', publicBucketUrl)
  await getFile('test-project.txt', projectBucketUrl)
}

main()
  .then(() => console.log('Done'))
  .catch(error => console.error('Error:', error))
  .finally(() => process.exit(0))
