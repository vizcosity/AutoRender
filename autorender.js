/**
 * Programmatic AutoRender Node.js module.
 */

const nexrender = require('@nexrender/core');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const ejs = require('ejs');
const { copyFileAndReturnFileURI } = require('./modules/resolveData');
const { createEncodeAction } = require('./nexrender_templates/render_modules/action-encode');
const winston = require('winston');
require('dotenv').config({path: path.resolve(__dirname, './private/opts.env')});


// Create the logger which will be used to output logs to the STDOUT stream
// as well as a logfile.
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({ filename: 'autorender.log' }),
    new winston.transports.Console(),
  ]
});

const _PLATFORM = determinePlatform();
const DEFAULT_AE_TEMPLATE_PATH = `./assets/STM_TEMPLATE_AUTORENDER_BUNDLED/`;
const DEFAULT_AE_AUTORENDER_SCRIPT_PATH = './scripts/stm_autorender_trapcode_15.jsx';
const DEFAULT_OUTPUT_PATH = './.output/';

var AE_TEMPLATE_PATH = (process.env.AE_TEMPLATE_PATH ? process.env.AE_TEMPLATE_PATH : DEFAULT_AE_TEMPLATE_PATH);
AE_TEMPLATE_PATH += `STM_TEMPLATE_AUTORENDER_TRAPCODE_15_NO_PSD_${process.platform === 'win32' ? 'WIN' : 'MAC'}.aep`;
if (process.env.AE_TEMPLATE) AE_TEMPLATE_PATH = process.env.AE_TEMPLATE;
var AE_TEMPLATE_URL = `file://${path.resolve(__dirname, AE_TEMPLATE_PATH)}`;

var AE_AUTORENDER_SCRIPT_PATH = process.env.AE_AUTORENDER_SCRIPT_PATH ? process.env.AE_AUTORENDER_SCRIPT_PATH : DEFAULT_AE_AUTORENDER_SCRIPT_PATH;
var AE_AUTORENDER_SCRIPT_URL = `file://${path.resolve(__dirname, AE_AUTORENDER_SCRIPT_PATH)}`;

var OUTPUT_PATH = path.resolve(__dirname, process.env.OUTPUT_PATH ? process.env.OUTPUT_PATH : DEFAULT_OUTPUT_PATH);
const WORKDIR_PATH = path.resolve(__dirname, OUTPUT_PATH, `.nexrender`);

const jobTemplate = require(path.resolve(__dirname, `./nexrender_templates/nexrender_template_lossless_${_PLATFORM}.json`));

// Configure the template by replacing placeholders with the script and asset paths.
const configureJobTemplate = ({
  jobTemplate, 
  projectScriptPath, 
  tempDir, 
  songDetails,
  encodeOutputAsMP4 = true
}) => {

  var jobJson = { ...jobTemplate };

  let {
    projectName, 
    songFile, 
    backgroundFile, 
    artworkFile, 
    outputPath
  } = songDetails;

  let fileExtension = jobJson.template.outputExt;

  if (!fileExtension) throw new Error("Could not determine file extension in job template.", jobJson);

  jobJson.template.src = AE_TEMPLATE_URL;

  // Here it's important that the paths are considered from the directory in which
  // the process itself is ran, as the paths will be relative to this directory.

  // TODO: Edit this to support songFiles.
  if (songFile) jobJson.assets.push({
    type: "audio",
    src: copyFileAndReturnFileURI(songFile, tempDir),
    // layerName: "Song",
    // Use layer indeces for now as they are more stable. (Multiple renders seem
    // to unreliably change the layerNames for subsequent renders)
    layerIndex: 1,
    composition: "Change Song"
  });

  if (backgroundFile) jobJson.assets.push({
    type: "image",
    src: copyFileAndReturnFileURI(backgroundFile, tempDir),
    // layerName: "Background",
    layerIndex: 2,
    composition: "Change Background"
  });

  if (artworkFile) jobJson.assets.push({
    type: "image",
    src: copyFileAndReturnFileURI(artworkFile, tempDir),
    // layerName: "Artwork",
    layerIndex: 3,
    composition: "Change Artwork"
  });

  jobJson.assets.push({
    type: 'script',
    src: `file://${path.resolve(projectScriptPath)}`
  });

  let outputNameWithoutExtension = `${OUTPUT_PATH}/${projectName}/${projectName}_render`;

  let encodedOutputName = path.basename

  // Add the action-copy postrender action.
  jobJson.actions.postrender[0].output = `${outputNameWithoutExtension}.${fileExtension}`; 

  // Add the action-encode postrender action, if specified.
  if (encodeOutputAsMP4)
    jobJson.actions.postrender.push(createEncodeAction({
      outputName: outputNameWithoutExtension
    }))

  return jobJson;
};

const configureScriptTemplate = (projectDetails, tempDir) => new Promise((resolve, reject) => {
  console.log(`Fetching script from`, AE_AUTORENDER_SCRIPT_PATH);
  fs.readFile(path.resolve(__dirname, AE_AUTORENDER_SCRIPT_PATH), (err, autorenderScriptTemplate) => {
    autorenderScriptTemplate = autorenderScriptTemplate.toString('utf8');

    // Replace placeholder contenet with project-specific details.
    var projectScript = ejs.render(autorenderScriptTemplate, projectDetails.songDetails);
    // log(`Reading autorenderScriptTemplate:`, autorenderScriptTemplate);
    // Write the script template to the output dir.
    const finalScriptLocation = path.resolve(tempDir, `${projectDetails.songDetails.projectName}_script.jsx`);
    fs.writeFile(finalScriptLocation, projectScript, err => {
      if (err) reject(err);
      log(`Written autorenderScriptTemplate to`, finalScriptLocation)
      return resolve(finalScriptLocation);
    });
  });
});

// Configures the directory structure by creating the project folder and temp folders.
const configureDirectoryStructure = ({outputPath, projectName}) => new Promise((resolve, reject) => {

  // Set the new OUTPUT_PATH.
  if (outputPath) OUTPUT_PATH = path.resolve(__dirname, outputPath);

  let tempDir = path.resolve(__dirname, OUTPUT_PATH, projectName, '.temp');

  log(`Creating temporary directory structure in`, tempDir);

  mkdirp(tempDir, (err) => {
    if (err) reject(err);
    return resolve(tempDir);
  });
});

const configureDirectoryStructureSync = (outputPath, projectName) => {

  // Set the new OUTPUT_PATH.
  if (outputPath) OUTPUT_PATH = path.resolve(__dirname, outputPath);

  let tempDir = path.resolve(__dirname, OUTPUT_PATH, projectName, '.temp');

  log(`Creating temporary directory structure in`, tempDir);

  mkdirp.sync(tempDir);

  return tempDir;

};

// Ensure that the workpath has been created, if it does not exist already.
log(`Ensuring that the output path`, WORKDIR_PATH, `exists.`);
mkdirp.sync(WORKDIR_PATH);

log(`Platform:`, _PLATFORM);

log(`Binary:`, process.env.BINARY || "unspecified.");

log(`Skip Cleanup:`, process.env.SKIP_CLEANUP);

// Configure settings.
const settings = nexrender.init({
    logger: console,
    workpath: OUTPUT_PATH,
    binary: process.env.BINARY,
    skipCleanup: process.env.SKIP_CLEANUP
});

module.exports = {
  // TODO: Add support for a callback function whic is called everytime the render progress changes, so that the Job object progress property can be updated.
  render: async function (params){

        var {
          outputPath,
          songDetails
        } = params;

        var { projectName, songName, artistName, genre, visualizerColour } = songDetails;

        log(`Recieved request to render with params:`, params, `and details`, songDetails);

        if (!projectName) return reject("Project name not supplied.");
        if (!songName || !artistName || !genre || !visualizerColour)
          return reject("Incomplete song details. Required: songName, artistName, genre, visualizerColour");

        log(`Configuring directory structure.`);
        let tempDir = await configureDirectoryStructure({outputPath, projectName});
        log(`Configured directory structure:`, fs.readdirSync(path.resolve(OUTPUT_PATH, projectName)));

        log(`Configuring script template.`);
        const projectScriptPath = await configureScriptTemplate(params, tempDir);
        log(`Saved + written script template.`);

        log(`Configuring jobJson`);
        const jobJson = configureJobTemplate({
          jobTemplate,
          projectScriptPath,
          tempDir,
          songDetails: params.songDetails
        });
        //const jobJson = configureJobTemplate(jobTemplate, projectScriptPath,tempDir, params.songDetails);
        log(`Configured jobJson:`, jobJson);
        fs.writeFileSync(path.resolve(__dirname, OUTPUT_PATH, projectName, '.temp', 'jobJson.json'), JSON.stringify(jobJson, null, 2));

        log(`Attempting to render now.`);
        const renderJob = await nexrender.render(jobJson, settings);
        // TODO: Add cleanup operation.
        log(`Finished rendering`, renderJob);

        return renderJob;
  },
  configureDirectoryStructure,
  configureDirectoryStructureSync,
  OUTPUT_PATH
}

function log(...msg){
  logger.info(`AUTORENDER | ${msg.map(obj => require('util').inspect(obj)).join(' ')}`);
}

function determinePlatform(){
  let platform = require('os').platform();
  switch (platform) {
    case 'darwin': 
      return 'mac';
    case 'win32':
      return 'windows';
    default: 
      throw new Error("Unsupported platform: " + platform);
  }

}