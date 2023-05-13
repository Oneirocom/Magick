require('dotenv').config({ path: '.env' }); // Load variables from .env
require('dotenv').config({ path: '.env.local' }); // Load variables from .env.local

const fs = require('fs');
const path = require('path');
const knex = require('knex');
const { v4 } = require('uuid');
const { Configuration, OpenAIApi }  = require('openai');



const processEnv = typeof process === 'undefined' ? {} : process.env
const postgresURI = process.env.DATABASE_URL; 
const db = knex({
  client: 'pg',
  connection: postgresURI
});

// Setup OpenAI client
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openAi = new OpenAIApi(configuration)

function parseMetadata(lines) {
    const metadata = {};
    let line = lines.shift();
    while (line !== '---') {
      if (line === undefined) return metadata;
      const [key, value] = line.split(': ').map(str => str.trim());
      if (key === 'hide_table_of_contents') {
        metadata[key] = value === 'true';
      } else if (key === 'sidebar_position') {
        metadata[key] = parseInt(value);
      } else {
        metadata[key] = value;
      }
      line = lines.shift();
    }
    return metadata;
  }
  
function parseMarkdownFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n');
  if (lines[0] !== '---') {
    return; //Handle no metadata case
  }
  lines.shift();  // Remove the first line (---)

  const metadata = parseMetadata(lines);
  const content = lines.join('\n');

  return { metadata, content };
}

function findMarkdownFiles(dir) {
  let markdownFiles = [];

  fs.readdirSync(dir).forEach((file) => {
    const absolutePath = path.join(dir, file);
    if (fs.statSync(absolutePath).isDirectory()) {
      markdownFiles = markdownFiles.concat(findMarkdownFiles(absolutePath));
    } else if (path.extname(absolutePath) === '.md') {
      markdownFiles.push(absolutePath);
    }
  });

  return markdownFiles;
}
async function embedWithOpenAI(content) {
  const embeddingResponse = await openAi.createEmbedding({
    model: 'text-embedding-ada-002',
    input: content,
  })

  const [{ embedding }] = embeddingResponse.data.data
  return "[" + embedding.toString() + "]"
}

function chunkContent(content, chunkSize) {
  let chunks = [];
  for (let i = 0; i < content.length; i += chunkSize) {
    chunks.push(content.substring(i, i + chunkSize));
  }
  return chunks;
}

function getVarForEnvironment(env) {
  return (
    processEnv[env] || // Check processEnv for env key
    processEnv[`VITE_APP_${env}`] || // Check VITE prefixed env variables
    processEnv[`NEXT_${env}`] || // Check NEXT prefixed env variables
    processEnv[`REACT_${env}`] // Check REACT prefixed env variables
  )
}
const crypto = require('crypto');

function calculateHash(content) {
  const hash = crypto.createHash('sha256');
  hash.update(content);
  return hash.digest('hex');
}


async function addContentToDb(content, projectId, chunkSize = 7000, meta) {
  const chunks = chunkContent(content.content, chunkSize);

  // Fetch all existing documents for this project and create a hash map
  const existingDocuments = await db('documents')
    .where('projectId', projectId)
    .where('type', 'markdown')
    .select();
  //console.log("Existing documents: " + JSON.stringify(existingDocuments));
  const hashMap = {};
  const dataMap = {};
  for (let doc of existingDocuments) {
    const hash = calculateHash(JSON.parse(doc.content)['chunk']);
    hashMap[hash] = doc.id;
    dataMap[JSON.parse(doc.content)['metadata'].id] = doc.id;
  }

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const newHash = calculateHash(chunk);

    if (hashMap.hasOwnProperty(newHash)) {
      console.log("Document already exists in database.")
      // If matching document found, no need to update
      continue;
    } else {
      // If no matching document found, create a new embedding and insert into database
      const embedding = await embedWithOpenAI(chunk);
      if (dataMap.hasOwnProperty(meta.id)){
          // If the document exists, update it
        const id = dataMap[meta.id];
        await db('documents').update({
          type: 'markdown',
          content: {metadata: content.metadata, chunk},
          projectId: projectId,
          date: new Date().toISOString(),
          embedding: embedding,
        }).where('id', id);
      } else {
        // If the document doesn't exist, insert a new one
        await db('documents').insert({
          id: v4(),
          type: 'markdown',
          content: {metadata: content.metadata, chunk},
          projectId: projectId,
          date: new Date().toISOString(),
          embedding: embedding,
        });
      }
    }
  }
}


(async () => {
  try {
    const projectId = getVarForEnvironment('PROJECT_ID') || 'bb1b3d24-84e0-424e-b4f1-57603f307a89';
    console.log("Project ID: " + projectId);
    
    const markdownFiles = findMarkdownFiles('/home/sshivaditya/Projects/MagickML/apps/docs/docs/api/classes/');
    
    for (let file of markdownFiles) {
      let tt = parseMarkdownFile(file);
      if (tt) {
        await addContentToDb(tt, projectId, 7000, tt.metadata);
      }
    }
    
    console.log("Content added successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
  
  process.exit();
})();
