#!/usr/bin/env node

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const l10n = path.resolve(__dirname, '..');
const pnpmScript = process.env.npm_execpath;

if (!pnpmScript) {
    throw new Error('Run this collector through pnpm so it can invoke sibling repository scripts.');
}

const resources = [
    {
        repo: 'scratch-blocks',
        input: 'msg/json/en.json',
        component: 'blocks',
        skipExtraction: true
    },
    {
        repo: 'scratch-vm',
        command: 'i18n:src',
        input: 'translations/core/en.json',
        component: 'extensions',
        prefix: 'nb.'
    },
    {
        repo: 'scratch-paint',
        command: 'i18n:src',
        input: 'translations/en.json',
        component: 'paint-editor'
    },
    {
        repo: 'scratch-gui',
        input: 'translations/en.json',
        component: 'interface',
        prefix: 'nb.'
    }
];

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const messageText = entry => typeof entry === 'string' ? entry : entry.message;

const runPnpm = (repoPath, args) => {
    const isExecutable = path.extname(pnpmScript).toLowerCase() === '.exe';
    const command = isExecutable ? pnpmScript : process.execPath;
    const commandArgs = isExecutable ? args : [pnpmScript, ...args];
    childProcess.execFileSync(command, commandArgs, {cwd: repoPath, stdio: 'inherit'});
};

for (const resource of resources) {
    const repoPath = path.join(root, resource.repo);
    process.stdout.write(`Extracting ${resource.repo} strings\n`);
    if (resource.skipExtraction) {
        process.stdout.write(`Using tracked ${resource.repo} English catalog\n`);
    } else if (resource.repo === 'scratch-gui') {
        const messagePath = path.join(repoPath, 'translations', 'messages', 'src');
        const temporaryOutput = path.join(repoPath, 'tmp.js');
        fs.rmSync(messagePath, {recursive: true, force: true});
        runPnpm(repoPath, ['exec', 'babel', 'src', '--out-file', temporaryOutput]);
        fs.rmSync(temporaryOutput, {force: true});
        childProcess.execFileSync(process.execPath, [
            path.join(l10n, 'scripts', 'build-i18n-src.js'),
            messagePath,
            path.join(repoPath, 'translations'),
            resource.prefix
        ], {stdio: 'inherit'});
    } else {
        runPnpm(repoPath, ['run', resource.command]);
    }

    const extracted = readJson(path.join(repoPath, resource.input));
    const upstream = readJson(path.join(l10n, 'editor', resource.component, 'en.json'));
    const additions = {};

    for (const id of Object.keys(extracted).sort()) {
        if (id.startsWith('tw.')) continue;
        if (resource.prefix && !id.startsWith(resource.prefix)) continue;
        if (!resource.prefix && upstream[id] === messageText(extracted[id])) continue;
        additions[id] = extracted[id];
    }

    const output = path.join(l10n, 'sources', `${resource.component}.json`);
    fs.mkdirSync(path.dirname(output), {recursive: true});
    fs.writeFileSync(output, `${JSON.stringify(additions, null, 2)}\n`);
    process.stdout.write(`Wrote ${Object.keys(additions).length} strings to ${path.relative(l10n, output)}\n`);
}
