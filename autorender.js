/**
 * Programmatic AutoRender Node.js module.
 */

const { init, render } = require('@nexrender/core');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, './private/opts.env')});

var nexrenderTemplate = require(path.resolve(__dirname, './nexrender_template.json'));

if (!process.env.AE_TEMPLATE_PATH) throw new Error("AE_TEMPLATE_PATH env variable is not set.");
if (!process.env.AE_AUTORENDER_SCRIPT_PATH) throw new Error("AE_AUTORENDER_SCRIPT_PATH env variable is not set.");

const jobTemplate = require(path.resolve(__dirname, './nexrender_template.json'));

// Configure the template by replacing placeholders with the script and asset paths.
const configureJobTemplate = (jobTemplate,  outputPath) => {

  var jobJson = { ...jobTemplate };

  jobJson.template.src = process.env.AE_TEMPLATE_PATH;
  jobJson.assets.src = process.env.AE_AUTORENDER_SCRIPT_PATH;
  if (outputPath) jobJson.actions.postrender[0].output = outputPath;

  return jobJson;
};

const configureScriptTemplate = (backgroundPath, artworkPath, songPath) => {
  
}

// Configure settings.
const settings = init({
    logger: console,
});

module.exports = {
  render: function (backgroundPath, artworkPath, songPath, outputPath){
    return new Promise((resolve, reject) => {

      const jobJson = configureJobTemplate(jobTemplate, outputPath);


    });
  }
}
