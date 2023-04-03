//write a script that reads manifest.json and runs a function "doStuff" on each file in the files array
const fs = require('fs');
const dovenv = require('dotenv-flow');
dovenv.config('../.env');

const directive = `Write jest unit tests for the typescript file. Use ES6 import syntax. Import all dependencies from the original file. Create mocks as necessary. Use the original file as a guide for what to test.`

const apiKey = process.env.OPENAI_API_KEY;

async function doStuff(file) {
    const contents = fs.readFileSync(file, 'utf8');

    if(!contents.includes('const') && !contents.includes('function') && !contents.includes('class')) {
        return console.log('skipping file because it has no functions or classes')
    }

    let outfilename = file.replace('.tsx', '.test.tsx').replace('.ts', '.test.ts')


    // if the file already has a test file, skip it
    if (fs.existsSync(outfilename)) {
        console.log('skipping file because it already has a test file')
        return;
    }

    if (!contents.startsWith('// DOCUMENTED')) {
        console.log('skipping file because it has not had documentation generated yet')
        return;
    }

    const messages = [
        { role: "system", content: directive },
        { role: "user", content: contents }
    ]

    // fetch openai api
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey,
        },
        body: JSON.stringify({
            messages: messages,
            model: 'gpt-4',
            max_tokens: 3172,
        })

    })

    const json = await response.json();
    console.log('json', json)

    const choices = json.choices;
    try {

        const messageContent = choices[0].message.content;


        let message = messageContent.replaceAll('```typescript', '```').replace('typescript', '').split('```')
        if (message.length > 2) {
            message = message[1];
        } else {
            message = message[0];
        }


        // write the file over the original
        fs.writeFileSync(outfilename, message.replace('// DOCUMENTED', '// DOCUMENTED + TESTED'), 'utf8');
    } catch (error) {
        console.log('error', error)
    }
}

const manifest = require('./manifest.json');

// sort the manifest so all .ts files are first, then .tsx files
manifest.files.sort((a, b) => {
    if (a.endsWith('.ts') && b.endsWith('.tsx')) {
        return -1;
    } else if (a.endsWith('.tsx') && b.endsWith('.ts')) {
        return 1;
    } else {
        return 0;
    }
})

// loop through each file in the manifest and run doStuff on it

async function processFiles() {
    for (let i = 0; i < manifest.files.length; i++) {
        const file = manifest.files[i];
        console.log('processing file: ' + file)
        await doStuff(file);
    }
}

processFiles();