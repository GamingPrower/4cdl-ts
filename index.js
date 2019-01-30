#!/usr/bin/env node
const request = require('request-promise-native');
const r = require('request');
const { createWriteStream } = require('fs');
const argv = require('minimist')(process.argv.slice(2));
function parseURL(...args) {
    const regex = /(http(s)?:\/\/.)?(www\.)?[boards.4channel|boards.4chan]{12,14}\.[org]{3}\b[-a-zA-Z0-9@:%_\+.~#?&//=]{3}[thread]{6}\/[0-9]{6,9}/;
    if (args[0].toString().match(regex)) {
        const url = args[0].match(regex)[0];
        const boardLetter = url.slice(-16, -15);
        const boardID = url.slice(-7);
        return [`http://a.4cdn.org/${boardLetter}/thread/${boardID}.json`, boardLetter, boardID];
    }
    if (args[0].toString().match(/\d{7}/) && args[1].match(/[a-z, A-Z]{1}/)) {
        const boardLetter = args[1].match(/[a-z, A-Z]{1}/)[0];
        const boardID = args[0].toString().match(/\d{7}/)[0];
        return [`http://a.4cdn.org/${boardLetter}/thread/${boardID}.json`, boardLetter, boardID];
    }
}
const parsedURL = parseURL(argv._[0], argv._[1]);
request({ uri: parsedURL[0], json: true })
    .then((data) => {
    const fileArray = [];
    data.posts.forEach((el) => {
        if (!el.tim)
            return;
        // tim: filename
        // ext: file extension(.jpg)
        fileArray.push(`${el.tim}${el.ext}`);
    });
    return fileArray;
})
    .then((arr) => {
    arr.forEach(el => {
        // https://github.com/request/request-promise
        // "However, STREAMING THE RESPONSE (e.g. .pipe(...)) is DISCOURAGED...Use the original Request library for that."
        r.head(`https://i.4cdn.org/${parsedURL[1]}/${el}`, () => {
            r({ url: `https://i.4cdn.org/${parsedURL[1]}/${el}`, encoding: null, forever: true })
                .on('error', (e) => { console.error(`File Download ${e}`); })
                .pipe(createWriteStream(el))
                .on('close', () => { console.log('File Downloaded!'); });
        });
    });
})
    .catch((error) => console.log(error));
