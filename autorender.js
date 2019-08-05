/**
 * Programmatic AutoRender Node.js module.
 */

const { init, render } = require('@nexrender/core');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, './private/opts.env')});

var nexrenderTemplate = require(path.resolve(__dirname, './nexrender_template.json'));

if (!process.env.AE_TEMPLATE_PATH) throw new Error("AE_TEMPLATE_PATH env variable is not set.")
  process.env.AE_TEMPLATE_PATH = './assets/STM_TEMPLATE_AUTORENDER_BUNDLED/STM_TEMPLATE_AUTORENDER_BUNDLED.aep';
if (!process.env.AE_AUTORENDER_SCRIPT_PATH)
  process.env.AE_AUTORENDER_SCRIPT_PATH = './scripts/stm_autorender_1.jsx';

const AE_TEMPLATE_PATH = `file://${path.resolve(process.env.AE_TEMPLATE_PATH)}`;
const AE_AUTORENDER_SCRIPT_PATH = `file://${path.resolve(process.env.AE_AUTORENDER_SCRIPT_PATH)}`;

const jobTemplate = require(path.resolve(__dirname, './nexrender_template.json'));

// Configure the template by replacing placeholders with the script and asset paths.
const configureJobTemplate = (jobTemplate,  outputPath) => {

  var jobJson = { ...jobTemplate };

  jobJson.template.src = AE_TEMPLATE_PATH;
  jobJson.assets.src = AE_AUTORENDER_SCRIPT_PATH;
  if (outputPath) jobJson.actions.postrender[0].output = path.resolve(outputPath);

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
