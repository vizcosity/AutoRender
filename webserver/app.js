/**
 * REST API for generating ACR and source codes using CRIMSON.
 *
 * @ Aaron Baw 2018
 */

// Dependencies.
const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const package = require('./package.json');
const endpointPrefix = `/api/v${package['api-version']}`;
const { JobManager } = require('./modules/JobManager');

const _PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Configuration: Setting up the job manager.
var manager = new JobManager();

app.post(`${endpointPrefix}/queueJob`, (req, res) => {

});


app.listen(_PORT, () => log(`Listening on`,
_PORT));

// Logging.
function log(...msg){
  if (process.env.DEBUG) console.log(basename(__filename.split('.')[0]).toUpperCase(), '|', ...msg);
}
