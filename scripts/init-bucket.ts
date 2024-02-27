import axios from 'axios';

const base = process.env.NEXT_AWS_BUCKET_ENDPOINT || 'http://localhost:9090';
const name = process.env.NEXT_AWS_BUCKET_NAME || 'magick';
const bucketUrl = `${base}/${name}`;

const createBucket = async () => {
  try {
    const response = await axios.put(bucketUrl);
    console.log('Bucket created:', response.data);
  } catch (error) {
    console.error('Error creating bucket:', error);
  }
};

const uploadFile = async (fileName: string, content: string) => {
  try {
    const response = await axios.put(`${bucketUrl}/${fileName}`, content, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    console.log('File uploaded:', response.data);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

const getFile = async (fileName: string) => {
  try {
    const response = await axios.get(`${bucketUrl}/${fileName}`, { responseType: 'text' });
    console.log('File content:', response.data);
  } catch (error) {
    console.error('Error getting file:', error);
  }
};

const main = async () => {
  await createBucket();
  await uploadFile('test.txt', 'hello world');
  await getFile('test.txt');
};

main()
  .then(() => console.log('Done'))
  .catch(error => console.error('Error:', error))
  .finally(() => process.exit(0));
