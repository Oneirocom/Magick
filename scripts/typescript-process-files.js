//write a script that reads manifest.json and runs a function "doStuff" on each file in the files array
const fs = require('fs');
const dovenv = require('dotenv-flow');
dovenv.config('../.env');

const directive = `Rewrite the Typescript that the user provides so that it is optimized, easy to read and conforms to Google code standards. Add per-line comments and ts-doc documentation for every class and function. Be sure to keep any imports and exports intact.`

const apiKey = process.env.OPENAI_API_KEY;

async function doStuff(file) {
    const contents = fs.readFileSync(file, 'utf8');

    if(contents.startsWith('// GENERATED')) {
        console.log('skipping file because it is already generated')
        return;
    }

    // if the length of contents is over 4000 long, skip it and move on
    if (contents.length > 2000) {
        console.log('skipping file because it is too long')
        return;
    } else {
        console.log('processing file, length is', contents.length)
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
            model: 'gpt-3.5-turbo',
        })

    })

    const json = await response.json();

    const choices = json.choices;

    const messageContent = choices[0].message.content;

    console.log('messageContent', messageContent.replaceAll('```typsecript', '').replaceAll('```', ''))

    // write the file over the original
    fs.writeFileSync(file, '// GENERATED \n' + messageContent.replaceAll('```typsecript', '').replaceAll('```', ''), 'utf8');
}

const manifest = require('./manifest.json');

// loop through each file in the manifest and run doStuff on it

async function processFiles() {
    for (let i = 0; i < manifest.files.length; i++) {
        const file = manifest.files[i];
        await doStuff(file);
    }
}

processFiles();