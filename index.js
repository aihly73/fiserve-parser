#!/usr/bin/env node

'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('graceful-fs'));
const moment = require('moment');

Promise.try(() => {

    const args = process.argv.slice(2);

    // Input Path
    const inputPath = args[0];
    if (!fs.existsSync(inputPath)) {
        throw new Error(`invalid inputPath: ${inputPath}`);
    }

    // Read File
    fs.readFileAsync(args[0], { encoding: 'utf8' })
        .then(file => {
            const lines = file
                .split(/\r?\n/)                   // split on newline
                .filter(x => !/^\s*$/.test(x));   // remove all blank lines

            lines.forEach((line, index) => {

            // Detect Transactions
                const match = /^(\d{6})\s+(\w{1,3})\s+(\d{6})\s+(.*)/.exec(line);
                const nextMatch = /^\s{17,}(.*)/.exec(lines[index + 1]);
                if (match) {
                    const postDate = moment(match[1], 'MMDDYY');
                    const code = match[2];
                    const dueDate = moment(match[3], 'MMDDYY');
                    const rest0 = match[4].trim();

                    console.log(`code: ${code.padEnd(3)} postDate: ${postDate.format('YYYY-MM-DD')} dueDate: ${dueDate.format('YYYY-MM-DD')}`);
                    if (rest0) {
                        console.log(`    >${rest0}`);
                    }
                    if (nextMatch) {
                        console.log(`    >${nextMatch[1]}`);
                    }
                }
            });
        });
}).catch(error => {
    console.error(error);
    process.exit(1);
});
