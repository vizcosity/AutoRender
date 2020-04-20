/**
 * REST API for generating ACR and source codes using CRIMSON.
 *
 * @ Aaron Baw 2018
 */

// Dependencies.
const dotenv = require('dotenv').config();
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const package = require('./package.json');
const endpointPrefix = `/api/v${package['api-version']}`;
const { JobManager } = require('./modules/JobManager');
const { readLog } = require('./modules/log');
const winston = require('winston');

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

      if (!jobDetail.songName || !jobDetail.songFile || !jobDetail.artistName || !jobDetail.genre)
        return res.send({
          success: false,
          reason: `Missing critical parameter. Recieved: ${JSON.stringify(jobDetail, null, 2)}`
        });

      log(`Created jobDetail for project:`, jobDetail.projectName);

      // Create a copy of the job object so that we don't overwrite the buffered
      // files.
      let job = manager.enqueueJob(jobDetail);

      return res.send({
        success: true,
        // The `truncateBuffers` paramter replaces all file buffers which have been
        // included in the original post request with `<BufferedFile>` string placeholders
        // to reduce space.
        job: req.body.truncateBuffers ? job.truncatedBuffers() : job
      })

});

app.delete(`${endpointPrefix}/job`, (req, res) => {
  if (!req.body.id) return res.send({success: false, reason: "Job ID not passed."});

  let removedJob = manager.queue.remove(req.body.id);

  return res.send({
    success: removedJob !== false,
    job: req.truncateBuffers ? removedJob.truncatedBuffers() : removedJob
  })

});

app.get(`${endpointPrefix}/jobDetail`, (req, res) => {
  if (!req.query.id) return res.send({success: false, reason: "Job ID not passed."});

    let job = manager.getJobById(req.body.id);

    if (!job) return res.send({success: false, reason: "No Job with given ID found."});
    return res.send({success: true, job: req.query.truncateBuffers ? job.truncatedBuffers() : job});

});

app.get(`${endpointPrefix}/jobResult`, (req, res) => {
  if (!req.query.id) return res.send({success: false, reason: "Job ID not passed."});

  let job = manager.getJobById(req.query.id);
  let jobResultPath = manager.getCompletedJobFilePath(req.query.id);
  if (!jobResultPath) return res.send({sucess: false, reason: "Likely uncompleted job or job not found.", job});

  res.download(jobResultPath);

  if (req.query.cleanup) rimraf(path.resolve(job.outputPath, '../'), () => log(`Cleaned`, path.resolve(job.outputPath, '../'), `for job`, job));
  return;
});

app.get(`${endpointPrefix}/jobs`, (req, res) => {

  if (req.query.filter) {
    let filtered = manager.queue[req.body.filter];
    if (!filtered) filtered = [];
    return res.send({success: true, jobs: req.query.truncateBuffers ? filtered.map(job => job.truncatedBuffers()) : filtered});
  }

  let jobs = manager.queue.all;
  return res.send({success: true, jobs: req.query.truncateBuffers ? jobs.map(job => job.truncatedBuffers()) : jobs});

});

app.get(`${endpointPrefix}/logs`, (req, res) => {

  // Read the last 100 lines from the log and display this.
  readLog(req.body.lines).then(log => res.send({
    success: true,
    lines: log.split('\n').length,
    log
  }));
  
});

app.listen(_PORT, () => log(`Listening on`,
_PORT));

// Logging.

// Create the logger which will be used to output logs to the STDOUT stream
// as well as a logfile.
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  // defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'autorender.log' }),
    new winston.transports.Console(),
  ]
});

function log(...msg){
  logger.info(`WEBSERVER APP | ${msg.map(obj => require('util').inspect(obj)).join(' ')}`);
}
