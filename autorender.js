/**
 * Programmatic AutoRender Node.js module.
 */

const nexrender = require('@nexrender/core');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const ejs = require('ejs');
require('dotenv').config({path: path.resolve(__dirname, './private/opts.env')});

var nexrenderTemplate = require(path.resolve(__dirname, './nexrender_template.json'));

const DEFAULT_AE_TEMPLATE_PATH = `./assets/STM_TEMPLATE_AUTORENDER_BUNDLED/`;
const DEFAULT_AE_AUTORENDER_SCRIPT_PATH = './scripts/stm_autorender_trapcode_15.jsx';
const DEFAULT_OUTPUT_PATH = './.output/';


var AE_TEMPLATE_PATH = (process.env.AE_TEMPLATE_PATH ? process.env.AE_TEMPLATE_PATH : DEFAULT_AE_TEMPLATE_PATH);
AE_TEMPLATE_PATH += `STM_TEMPLATE_AUTORENDER_TRAPCODE_15_${process.platform === 'win32' ? 'WIN' : 'MAC'}.aep`;
var AE_TEMPLATE_URL = `file://${path.resolve(__dirname, AE_TEMPLATE_PATH)}`;

var AE_AUTORENDER_SCRIPT_PATH = process.env.AE_AUTORENDER_SCRIPT_PATH ? process.env.AE_AUTORENDER_SCRIPT_PATH : DEFAULT_AE_AUTORENDER_SCRIPT_PATH;
var AE_AUTORENDER_SCRIPT_URL = `file://${path.resolve(__dirname, AE_AUTORENDER_SCRIPT_PATH)}`;

var OUTPUT_PATH = path.resolve(__dirname, process.env.OUTPUT_PATH ? process.env.OUTPUT_PATH : DEFAULT_OUTPUT_PATH);

const jobTemplate = require(path.resolve(__dirname, './nexrender_template.json'));

// Configure the template by replacing placeholders with the script and asset paths.
const configureJobTemplate = (jobTemplate, projectScriptPath, {projectName, songPath, backgroundPath, artworkPath, outputPath}) => {

  var jobJson = { ...jobTemplate };

  jobJson.template.src = AE_TEMPLATE_URL;

  // Here it's important that the paths are considered from the directory in which
  // the process itself is ran, as the paths will be relative to this directory.

  // TODO: Edit this to support songFiles.
  if (songPath) jobJson.assets.push({
    type: "audio",
    src: `file://${path.resolve(songPath)}`,
    layerName: "Song",
    composition: "Change Song"
  });

  if (backgroundPath) jobJson.assets.push({
    type: "image",
    src: `file://${path.resolve(backgroundPath)}`,
    layerName: "Background",
    composition: "Change Background"
  });

  if (artworkPath) jobJson.assets.push({
    type: "image",
    src: `file://${path.resolve(artworkPath)}`,
    layerName: "Artwork",
    composition: "Change Artwork"
  });

  jobJson.assets.push({
    type: 'script',
    src: `file://${path.resolve(projectScriptPath)}`
  });

  jobJson.actions.postrender[0].output = `${OUTPUT_PATH}/${projectName}/${projectName}_render.mp4`;


  return jobJson;
};

const configureScriptTemplate = (projectDetails) => new Promise((resolve, reject) => {
  console.log(`Fetching script from`, AE_AUTORENDER_SCRIPT_PATH);
  fs.readFile(path.resolve(__dirname, AE_AUTORENDER_SCRIPT_PATH), (err, autorenderScriptTemplate) => {
    autorenderScriptTemplate = autorenderScriptTemplate.toString('utf8');

    // Replace placeholder contenet with project-specific details.
    var projectScript = ejs.render(autorenderScriptTemplate, projectDetails.songDetails);
    // log(`Reading autorenderScriptTemplate:`, autorenderScriptTemplate);
    // Write the script template to the output dir.
    const finalScriptLocation = path.resolve(__dirname, OUTPUT_PATH, projectDetails.projectName,  '.temp', `${projectDetails.projectName}_script.jsx`);
    fs.writeFile(finalScriptLocation, projectScript, err => {
      if (err) reject(err);
      log(`Written autorenderScriptTemplate to`, finalScriptLocation)
      return resolve(finalScriptLocation);
    });
  });
});

// Configures the directory structure by creating the project folder and temp folders.
const configureDirectoryStructure = (outputPath, projectName) => new Promise((resolve, reject) => {

  // Set the new OUTPUT_PATH.
  if (outputPath) OUTPUT_PATH = path.resolve(__dirname, outputPath);

  let tempDir = path.resolve(__dirname, OUTPUT_PATH, projectName, '.temp');

  log(`Creating temporary directory structure in`, tempDir);

  mkdirp(tempDir, (err) => {
    if (err) reject(err);
    return resolve();
  });
});

// Configure settings.
const settings = nexrender.init({
    logger: console,
});

module.exports = {
  render: function (params){
    return new Promise(async (resolve, reject) => {

      var {
        projectName,
        outputPath,
        songDetails
      } = params;

      var { songName, artistName, genre, visualizerColour } = songDetails;

      log(`Recieved request to render with params:`, params, `and details`, songDetails);

      if (!projectName) return reject("Project name not supplied.");
      if (!songName || !artistName || !genre || !visualizerColour)
        return reject("Incomplete song details. Required: songName, artistName, genre, visualizerColour");

      log(`Configuring directory structure.`);
      await configureDirectoryStructure(outputPath, projectName);
      log(`Configured directory structure:`, fs.readdirSync(OUTPUT_PATH));

      log(`Configuring script template.`);
      const projectScriptPath = await configureScriptTemplate(params);
      log(`Saved + written script template.`);

      log(`Configuring jobJson`);
      const jobJson = configureJobTemplate(jobTemplate, projectScriptPath, params.songDetails);
      log(`Configured jobJson:`, jobJson);
      fs.writeFileSync(path.resolve(__dirname, OUTPUT_PATH, projectName, '.temp', 'jobJson.json'), JSON.stringify(jobJson, null, 2));

      log(`Attempting to render now.`);
      const renderJob = await nexrender.render(jobJson, settings);
      log(`Finished rendering`, renderJob);

      return resolve(renderJob);

    });
  }
}

function log(...msg){
  console.log(`AUTORENDER |`, ...msg);
}
