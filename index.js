#!/usr/bin/env node

'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('graceful-fs'));

const args = process.argv.slice(2);
console.log(args);
fs.readFileAsync(args[0], { encoding: 'utf8' })
    .then(file => {
        const lines = file
            .split(/\r?\n/)                   // split on newline
            .filter(x => !/^\s*$/.test(x));   // remove all blank lines

        console.log(lines);
    });
