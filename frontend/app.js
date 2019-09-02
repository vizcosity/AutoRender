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
const _AUTORENDER_API_ENDPOINT = !process.env.development ? process.env.AUTORENDER_API_ENDPOINT : "http://localhost:3000";

if (!_AUTORENDER_API_ENDPOINT) throw new Error("AutoRender API endpoint not set.");

// TODO: Configure static routes.
if (!process.env.DEVELOPMENT){
  app.use('/', express.static(path.join(__dirname, 'build')))
  // Redirect all get requests to index.
  app.get('/*', (req, res, next) => {
    if (req.path === '/newRenderJob' || req.path === '/manageJobs')
    return res.sendFile(path.resolve(__dirname, './build', 'index.html'));

    return next();
  });

} else log(`Running in development mode on endpoint`, _AUTORENDER_API_ENDPOINT);

app.use(proxy(_AUTORENDER_API_ENDPOINT, {
  limit: '500mb'
}));

app.listen(_PORT, () => log(`Listening on`,
_PORT));

// Logging.
function log(...msg){
  console.log(path.basename(__filename.split('.')[0]).toUpperCase(), '|', ...msg);
}
