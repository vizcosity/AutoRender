/**
 * Module for resolving data into valid URIS for use with nexrender.
 *
 * @ Aaron Baw 2019
 */

const path = require('path');
const fs = require('fs');
const Datauri = require('datauri');
const fileType = require('file-type');
const mkdirp = require('mkdirp');

const datauri = new Datauri();

// Given a data objec,t either a blob or a buffer, encodes it as a base64 URI.
const encodeDataAsBase64URI = data => {

    let filetype = fileType(data).ext;

    // Convert to a buffer incase the incoming data is a blob.
    let buffer = Buffer.from(data);
    let base64String = buffer.toString('base64');

    console.log(filetype, base64String.slice(0, 10));

    return `${datauri.format(filetype, base64String).content}`;
}

const encodePathAsURI = input => {
    // This assumes that the file path has been provided relative to the
    // working directory of the initiated node process.
    return `file://${path.resolve(input)}`;
}

 // Given either a Blob, Buffer, or String, resolves the argument into a valid
 // data source URI for nexrender to interpret.
 const resolveFileURI = input => {
   return typeof input === 'string' ?
    encodePathAsURI(input) : encodeDataAsBase64URI(input);
 };

 const copyFileAndReturnPath = (file, copyDir) => {

     // If the file is a path, copy it to the temporary asset directory -
     // otherwise we need to write it to a file, using a random name.
     log(`Copying file`, file);
     log(`Creating copyDir:`, path.resolve(copyDir), `if it doesn't exist.`);
     mkdirp.sync(path.resolve(copyDir))

     if (typeof file === 'string'){

       let filename = path.basename(file);
       let copiedFilePath = path.resolve(copyDir, filename)

       fs.copyFileSync(path.resolve(file), copiedFilePath);

       return copiedFilePath;
     } else {

       // Write the file to disk.
       // Get fhe filetype.
       let fileBuffer = Buffer.from(file);
       let filetype = fileType(fileBuffer).ext;
       let randomName = Math.random().toString(36).substring(2);
       let filename = `${randomName}.${filetype}`;
       let copiedFilePath = path.resolve(copyDir, filename);

       log(`Writing filebuffer to`, copiedFilePath);

       fs.writeFileSync(copiedFilePath, file, {
         mode: 0o777,
         encoding: 'binary'
       });

       return copiedFilePath;
     }

 }

 const copyFileAndReturnFileURI = (file, copyDir) => resolveFileURI(copyFileAndReturnPath(file, copyDir));

 module.exports = {
   resolveFileURI,
   encodeDataAsBase64URI,
   copyFileAndReturnPath,
   copyFileAndReturnFileURI
 }

function log(...msg){
  console.log(`AUTORENDER [RESOLVE DATA]`, ...msg);
}
