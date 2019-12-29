/**
 * Abstracted log module for creating and fetching logs.
 *
 * @ Aaron Baw  2019
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Stream = require('stream');
const _DEFAULT_LOG_PATH = path.resolve(__dirname, '../', 'autorender.log');

const readLog = (lines = 100) => new Promise((resolve, reject) => {

  var logText = "";

  // Create a read stream, and continue reading until we find a new line character,
  // then decrement the line variable.
  var readStream = fs.createReadStream(_DEFAULT_LOG_PATH);
  var outStream = new Stream();
  var lineReader = readline.createInterface(readStream, outStream);

  lineReader.on('line', line => {
    logText += line + '\n';
    lines--;
    if (lines === 0) resolve(logText);
  });

  lineReader.on('close', () => resolve(logText));
});

module.exports = {
  readLog
};
