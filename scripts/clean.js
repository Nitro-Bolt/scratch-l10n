#!/usr/bin/env node

const fs = require('node:fs');

for (const path of ['dist', 'locales']) {
    fs.rmSync(path, {recursive: true, force: true});
    fs.mkdirSync(path, {recursive: true});
}
