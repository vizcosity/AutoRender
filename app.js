/**
 * REST API for generating ACR and source codes using CRIMSON.
 *
 * @ Aaron Baw 2018
 */

// Dependencies.
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const proxy = require('express-http-proxy');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config()

const _PORT = process.env.PORT || 4070;
const _AUTORENDER_API_ENDPOINT = process.env.AUTORENDER_API_ENDPOINT;

if (!_AUTORENDER_API_ENDPOINT) throw new Error("AutoRender API endpoint not set.");

app.use(proxy('http://localhost:3050', {
  limit: '500mb'
}));

// TODO: Configure static routes.
if (!process.env.DEVELOPMENT){
  app.use('/', express.static(path.join(__dirname, 'build')))
}

app.listen(_PORT, () => log(`Listening on`,
_PORT));

// Logging.
function log(...msg){
  console.log(path.basename(__filename.split('.')[0]).toUpperCase(), '|', ...msg);
}
