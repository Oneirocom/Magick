const fs = require('fs');
const crypto = require('crypto');
const { glob } = require('glob');
const yargs = require('yargs');

const { argv } = yargs
	.command('globs', 'Get globs hash', {
		list: {
			description: 'List',
			type: 'array',
		},
	})
	.help();

const list = argv.list || [];
const files = glob.sync(list);
const hash = crypto.createHash('sha256');

files.forEach((file) => {
	const fileContent = fs.readFileSync(file);
	hash.update(fileContent);
});

console.log(hash.digest('hex'));