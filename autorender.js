/**
 * Programmatic AutoRender Node.js module.
 */

const nexrender = require('@nexrender/core');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
require('dotenv').config({path: path.resolve(__dirname, './private/opts.env')});

var nexrenderTemplate = require(path.resolve(__dirname, './nexrender_template.json'));

const DEFAULT_AE_TEMPLATE_PATH = './assets/STM_TEMPLATE_AUTORENDER_BUNDLED/STM_TEMPLATE_AUTORENDER_TRAPCODE_15.aep';
const DEFAULT_AE_AUTORENDER_SCRIPT_PATH = './scripts/stm_autorender_trapcode_15.jsx';
const DEFAULT_OUTPUT_PATH = './.output/';

var AE_TEMPLATE_PATH = process.env.AE_TEMPLATE_PATH ? process.env.AE_TEMPLATE_PATH : DEFAULT_AE_TEMPLATE_PATH;
var AE_TEMPLATE_URL = `file://${path.resolve(AE_TEMPLATE_PATH)}`;

var AE_AUTORENDER_SCRIPT_PATH = process.env.AE_AUTORENDER_SCRIPT_PATH ? process.env.AE_AUTORENDER_SCRIPT_PATH : DEFAULT_AE_AUTORENDER_SCRIPT_PATH;
var AE_AUTORENDER_SCRIPT_URL = `file://${path.resolve(AE_AUTORENDER_SCRIPT_PATH)}`;

var OUTPUT_PATH = path.resolve(process.env.OUTPUT_PATH ? process.env.OUTPUT_PATH : DEFAULT_OUTPUT_PATH);

const jobTemplate = require(path.resolve(__dirname, './nexrender_template.json'));

// Configure the template by replacing placeholders with the script and asset paths.
const configureJobTemplate = (jobTemplate, {projectName, songPath, backgroundPath, artworkPath, outputPath}) => {

  var jobJson = { ...jobTemplate };

  jobJson.template.src = AE_TEMPLATE_URL;
  jobJson.assets[0].src = AE_AUTORENDER_SCRIPT_URL;
  jobJson.actions.postrender[0].output = `${OUTPUT_PATH}/${projectName}/${projectName}_render.mp4`;

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

  return jobJson;
};

const configureScriptTemplate = ({projectName, backgroundPath, artworkPath, songPath, outputPath}) => new Promise((resolve, reject) => {
  console.log(`Fetching script from`, AE_AUTORENDER_SCRIPT_PATH);
  fs.readFile(path.resolve(AE_AUTORENDER_SCRIPT_PATH), (err, autorenderScriptTemplate) => {
    autorenderScriptTemplate = autorenderScriptTemplate.toString('utf8');
    // log(`Reading autorenderScriptTemplate:`, autorenderScriptTemplate);
    // Write the script template to the output dir.
    const finalScriptLocation = path.resolve(OUTPUT_PATH, projectName,  '.temp', `${projectName}_script.jsx`);
    fs.writeFile(finalScriptLocation, autorenderScriptTemplate, err => {
      if (err) reject(err);
      log(`Written autorenderScriptTemplate to`, finalScriptLocation)
      return resolve(finalScriptLocation);
    });
  });
});

// Configures the directory structure by creating the project folder and temp folders.
const configureDirectoryStructure = (outputPath, projectName) => new Promise((resolve, reject) => {

  // Set the new OUTPUT_PATH.
  if (outputPath) OUTPUT_PATH = path.resolve(outputPath);

  log(`Creating directory structure in`, path.resolve(OUTPUT_PATH, projectName, '.temp'));

  mkdirp(path.resolve(OUTPUT_PATH, projectName, '.temp'), (err) => {
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

      var {projectName, backgroundPath, artworkPath, songPath, outputPath} = params;

      if (!projectName) throw new Error("Project name not supplied.");

      log(`Configuring directory structure.`);
      await configureDirectoryStructure(outputPath, projectName);
      log(`Configured directory structure:`, fs.readdirSync(OUTPUT_PATH));

      log(`Configuring jobJson`);
      const jobJson = configureJobTemplate(jobTemplate, params);
      log(`Configured jobJson:`, jobJson);
      fs.writeFileSync(path.resolve(OUTPUT_PATH, projectName, '.temp', 'jobJson.json'), JSON.stringify(jobJson, null, 2));

      log(`Configuring script template.`);
      const workingScriptPath = await configureScriptTemplate(params);
      log(`Saved + written script template.`);

      log(`Attempting to render now.`);
      const renderJob = await nexrender.render(jobJson, settings);
      log(`Finished rendering`, renderJob);

    });
  }
}

function log(...msg){
  console.log(`AUTORENDER |`, ...msg);
}
