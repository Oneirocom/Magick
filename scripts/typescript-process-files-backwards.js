//write a script that reads manifest.json and runs a function "doStuff" on each file in the files array
const fs = require('fs');
const dovenv = require('dotenv-flow');
dovenv.config('../.env');

const directive = `Rewrite the user's code so that it is optimized, easy to read and conforms to Google code standards. Preserve functionality and imports. Add per-line comments and tsdoc documentation for every class and function. Avoid using 'Function', 'Object' or 'any' for types.`

const apiKey = process.env.OPENAI_API_KEY;

async function doStuff(file) {
    const contents = fs.readFileSync(file, 'utf8');

    if (contents.startsWith('// DOCUMENTED')) {
        console.log('skipping file because it is already generated')
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
        fs.writeFileSync(file, '// DOCUMENTED \n' + message, 'utf8');
    } catch (error) {
        console.log('error', error)
    }
}

const manifest = require('./manifest.json');

// loop through each file in the manifest and run doStuff on it

async function processFiles() {
    for (let i = manifest.files.length - 1; i >= 0; i--) {
        const file = manifest.files[i];
        console.log('processing file: ' + file)
        await doStuff(file);
    }
}

processFiles();