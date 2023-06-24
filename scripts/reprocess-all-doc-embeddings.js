// This PR will reprocess the embeddings for all documents
const { Client } = require('pg');
const dotenv = require('dotenv-flow');
const { Configuration, OpenAIApi }  = require('openai');

dotenv.config('../');

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openAi = new OpenAIApi(configuration)

async function embedWithOpenAI(content) {
    const embeddingResponse = await openAi.createEmbedding({
      model: 'text-embedding-ada-002',
      input: content,
    })
  
    const [{ embedding }] = embeddingResponse.data.data
    return "[" + embedding.toString() + "]"
  }

// Connect to your Postgres database
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});
client.connect();

// Function to update the events in your database
async function updateEmbeddings() {
  // Start a transaction
  await client.query('BEGIN');

  // Get the events from your database
  const res = await client.query('SELECT id, content, embedding FROM documents');
  for (let row of res.rows) {
    let rowContent;
    // if content is json, parse it
    if (typeof row.content === 'string' && row.content[0] === '{') {
        try {
            rowContent = JSON.parse(row.content);
        } catch (e) {
            console.log('not json')
        }
        if(rowContent) {
            const description = rowContent.description;
            if( description && description.length > 0) {
                row.content = description;
            }
        }
    }

    console.log('row.content', row.content)
    // set the embedding to null
    // Fetch new embedding for the event
    const newEmbedding = await embedWithOpenAI(row.content);
    // Update the event in the database
    const response = await client.query(
      'UPDATE documents SET embedding = $1 WHERE id = $2',
      [newEmbedding, row.id]
    );
    console.log('response?', response)
  }
  console.log('done')

  // Commit the transaction
  await client.query('COMMIT');
}

// Call the function to start updating embeddings
updateEmbeddings().catch(e => {
  console.error(e);
  // If there was an error, roll back the transaction
  client.query('ROLLBACK');
}).finally(() => {
  // Close the database connection
  client.end();
  console.log('committed')
});
