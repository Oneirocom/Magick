// write a script that gets all the typescript files (ts and tsx) in the project and saves them to manifest.json in the same folder as this script
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const root = path.join(__dirname, '../');

// ignore node_modules, .d.ts, and .test.ts files

const tsFiles = glob.sync('**/*.ts?(x)', {
    cwd: root,
    ignore: [
        'node_modules/**/*',
        '**/*/node_modules/**/*',
        '**/*/migrations/**/*',
        '**/*.d.ts',
        '**/*.test.ts?(x)',
        '**/*.config.ts',
        '**/*/knexfile.ts',
        "**/*/plugins.ts",
        "**/*/environments/**/*",
    ],
});

const manifest = {
    files: tsFiles,
};

fs.writeFileSync(path.join(__dirname, 'manifest.json'), JSON.stringify(manifest, null, 4));
