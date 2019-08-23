/**
 * REST API for generating ACR and source codes using CRIMSON.
 *
 * @ Aaron Baw 2018
 */

// Dependencies.
const dotenv = require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const package = require('./package.json');
const endpointPrefix = `/api/v${package['api-version']}`;
const { JobManager } = require('./modules/JobManager');

// const upload = multer({
//   dest: resolve(__dirname, "./.uploads"),
//   preservePath: true,
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './.uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + extname(file.originalname))
//     }
//   })
// });
const upload = multer({ des: path.resolve(__dirname, './.uploads')});

const _PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Configuration: Setting up the job manager.
var manager = new JobManager();

const generateRandomProjectName = () => Math.random().toString(36).substring(2);

app.post(`${endpointPrefix}/queueJob`, upload.fields([{
  name: 'songFile',
  maxCount: 1
},
{
  name: 'artworkFile',
  maxCount: 1
},
{
  name: 'backgroundFile',
  maxCount: 1
}]), (req, res) => {

    if (!req.body.projectName) req.body.projectName = generateRandomProjectName();

      // Prepare job details.
      let jobDetail = {
        ...req.body
      };

      Object.keys(req.files).forEach(fieldname => {
        console.log(`Adding`,req.files[fieldname][0]);
        jobDetail[fieldname] = req.files[fieldname][0].buffer
      });

      console.log(jobDetail);

      if (!jobDetail.songName || !jobDetail.songFile || !jobDetail.artistName || !jobDetail.genre)
        return res.send({
          success: false,
          reason: `Missing critical parameter. Recieved: ${JSON.stringify(jobDetail, null, 2)}`
        });

      log(`Created jobDetail for project:`, jobDetail.projectName);

      let job = manager.enqueueJob(jobDetail);

      return res.send({
        success: true,
        job
      })

});


app.listen(_PORT, () => log(`Listening on`,
_PORT));

// Logging.
function log(...msg){
  if (process.env.DEBUG) console.log(path.basename(__filename.split('.')[0]).toUpperCase(), '|', ...msg);
}
