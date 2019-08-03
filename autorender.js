/**
 * Programmatic AutoRender Node.js module.
 */

const { init, render } = require('@nexrender/core');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, './private/opts.env')});

var nexrenderTemplate = require(path.resolve(__dirname, './nexrender_template.json'));

if (!process.env.AE_TEMPLATE_PATH) throw new Error("AE_TEMPLATE_PATH env variable is not set.");
if (!process.env.AE_AUTORENDER_SCRIPT) throw new Error("AE_AUTORENDER_SCRIPT env variable is not set.");


module.exports = {
  render: function (backgroundPath, artworkPath, songPath){
    return new Promise((resolve, reject) => {

    });
  }
}
