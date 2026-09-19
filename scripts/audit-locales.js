#!/usr/bin/env babel-node

const fs = require('fs');
const path = require('path');

import scratchLocales, {localeMap} from '../src/supported-locales.js';

const root = path.resolve(__dirname, '..');
const components = ['blocks', 'extensions', 'interface', 'paint-editor'];
const turboWarpTranslations = JSON.parse(
    fs.readFileSync(path.join(root, 'turbowarp-translations.json'), 'utf8')
);

const localesIn = directory => fs.readdirSync(directory)
    .filter(filename => filename.endsWith('.json'))
    .map(filename => path.basename(filename, '.json'))
    .sort();

const scratch = Object.keys(scratchLocales).sort();
const turboWarp = Object.keys(turboWarpTranslations).sort();
const nitroBolt = {};
for (const component of components) {
    nitroBolt[component] = localesIn(path.join(root, 'overrides', 'editor', component));
}

const report = {
    scratch,
    turboWarp,
    nitroBolt,
    scratchToTransifex: localeMap
};

if (process.argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
    process.stdout.write(`Scratch (${scratch.length}): ${scratch.join(', ')}\n`);
    process.stdout.write(`TurboWarp (${turboWarp.length}): ${turboWarp.join(', ')}\n`);
    for (const component of components) {
        const componentLocales = nitroBolt[component];
        process.stdout.write(`NitroBolt ${component} (${componentLocales.length}): ${componentLocales.join(', ')}\n`);
    }
    const mappings = Object.keys(localeMap)
        .sort()
        .map(locale => `${locale} -> ${localeMap[locale]}`);
    process.stdout.write(`Transifex mappings: ${mappings.join(', ')}\n`);
}
