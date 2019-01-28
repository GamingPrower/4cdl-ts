#!/usr/bin/env node
/* tslint:disable:no-var-requires */
const request = require('request-promise-native');
const { createWriteStream } = require('fs');
const argv = require('minimist')(process.argv.slice(2));

function parseURL(...args: string[]) {
	const regex: RegExp = /(http(s)?:\/\/.)?(www\.)?[boards.4channel]{14}\.[org]{3}\b[-a-zA-Z0-9@:%_\+.~#?&//=]{3}[thread]{6}\/[0-9]{6,9}/;

	if (args[0].toString().match(regex)) {
		const url = args[0].match(regex)[0];
		const boardLetter: string = url.slice(-16, -15);
		const boardID: string = url.slice(-7);
		return [`http://a.4cdn.org/${boardLetter}/thread/${boardID}.json`, boardLetter, boardID];
	}
	if (args[0].toString().match(/\d{7}/) && args[1].match(/[a-z, A-Z]{1}/)) {
		const boardLetter: string = args[1].match(/[a-z, A-Z]{1}/)[0];
		const boardID: string = args[0].toString().match(/\d{7}/)[0];
		return [`http://a.4cdn.org/${boardLetter}/thread/${boardID}.json`, boardLetter, boardID];
	}
}

const parsedURL: string[] = parseURL(argv._[0], argv._[1]);

request({ uri: parsedURL[0], json: true })
	.then((data: { posts: object[]; }) => {
		const fileArray: string[] = [];

		data.posts.forEach((el: { tim: string, ext: string }) => {
			if (!el.tim) return;
			// tim: filename
			// ext: file extension(.jpg)

			fileArray.push(`${el.tim}${el.ext}`);
		});
		return fileArray;
	})
	.then((arr: string[]) => {
		arr.forEach(el => {
			request.head(`https://i.4cdn.org/${parsedURL[1]}/${el}`, () => {
				request({ url: `https://i.4cdn.org/${parsedURL[1]}/${el}`, encoding: null, forever: true })
					.pipe(createWriteStream(el))
					.on('close', () => { console.log('File Downloaded!'); })
					.on('error', (e: Error) => { console.log(e); });
			});
		});
	})
	.catch((error: Error) => console.log(error));
