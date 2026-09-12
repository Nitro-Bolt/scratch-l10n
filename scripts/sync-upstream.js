#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const source = path.resolve(
    __dirname,
    '../../scratch-gui/src/lib/tw-translations/generated-translations.json'
);
const destination = path.resolve(__dirname, '../turbowarp-translations.json');

if (!fs.existsSync(source)) {
    throw new Error(`Cannot find TurboWarp translations at ${source}`);
}

const translations = JSON.parse(fs.readFileSync(source, 'utf8'));
fs.writeFileSync(destination, `${JSON.stringify(translations, null, 4)}\n`);
console.log(`Updated ${destination} from the local scratch-gui fork.`);
