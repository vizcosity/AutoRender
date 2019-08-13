/**
 * STM AutoRender script.
 *
 * This script replaces all the assets in the STM template with those passed
 * to the module function, and organises the composition for rendering
 * accordingly.
 *
 * @ Aaron Baw 2019.
 */

// NOTES:
// - Use cmd-shift-p to bring up the ESTK task runner to be able to evaluate
// AE ESTK commands from Atom.
// - Use alt-cmd-r to directly run the script inside of after effects.

// SONG SPECIFIC DETAILS
var songName = 'Sad Machine';
var artistName = 'Porter Robinson';
var genre = 'Progressive House';
var visualizerColour = '#c7254e';

// START: Change Song & Artist Name
var changeSongTitleComp = app.project.item(5);
var artistNameLayer = changeSongTitleComp.layer(4);
var songNameLayer = changeSongTitleComp.layer(5);
artistNameLayer.property("Source Text").setValue(artistName);
songNameLayer.property("Source Text").setValue(songName);
// END Change Song & Artist Name

// START: Change genre.
var changeGenreComp = app.project.item(3);
var genreLayer = changeGenreComp.layer(2);
genreLayer.property("Source Text").setValue(genre);


// START: TRIM 'Change Song' COMP TO SONG LENGTH.
var changeSongComp = app.project.item(4);
var song = changeSongComp.layer(1);
var duration = song.outPoint - song.inPoint;
changeSongComp.duration = duration;
// END: TRIM 'Change Song' COMP TO SONG LENGTH.

// START: Change visualizer colour.
var changeColourComp = app.project.item(6);

  // Trim the composition length to the length of the 'change song' layer.
  var changeSongLayer = changeColourComp.layer(10);
  changeColourComp.duration = changeSongLayer.outPoint - changeSongLayer.inPoint;

  // Make sure each layer is as long as the entire composition.
  // for (var i = 1; i < changeColourComp.numLayers; i++){
  //         var layer = changeColourComp.layer(i);
  //
  //         // If thel layer hasn't been marked with an 'Red' label, then we
  //         // set the layer length to that of the entire composition.
  //         if (layer.label === 1) continue;
  //
  //         // Set the inPoint to 0 so that the layer starts from the very beginning of the composition.
  //         layer.inPoint = 0;
  //         // Set the outPoint to be the entire duration of the composition.
  //         layer.outPoint = changeColourComp.duration;
  // }
  trimLayersToComp(changeColourComp, 1);
  // End trimming 'Change Visualizer Colour' layer items being fitted to comp length.

var visualizer = changeColourComp.layer(7);
// Note that all the form properties are flattened and have to be indexed at the
// same level without nesting.
// This rests at a different index for Trapcode 14.
var form = visualizer.property("Effects")("Form");

// var formEffect = visualizer.property("Effects")("Form").property(70);
var formEffect = getPropertyByName(form, "Color");
if (!formEffect) alert("Could not find Color property for Trapcode Form.");
// alert(formEffect.name);
formEffect.setValue(hexToNormalisedRGB(visualizerColour));
// END: Change visualizer colour.


// START: Trim the 'QHQ Chromatic Aberration Source' comp to fit 'Change Song'
// layer length.
var chromaticAbberationComp = app.project.item(7);
// alert(chromaticAbberationComp);
chromaticAbberationComp.duration = chromaticAbberationComp.layer(3).outPoint - chromaticAbberationComp.layer(3).inPoint;
// END: Trim the 'QHQ Chromatic Aberration Source' comp to fit 'Change Song'
// layer length.

// START: Trim all 'Render' composition layers and adjust internal layers to
// fit to the composition length. (E.g. for 720p & 1080p).
var renderComps = getCompsIncludingName('Render');

// First set the duration of the 'Render' layers to that of the Final Video length.

// Trim all layers to fit to comp duration.
for (var i = 0; i < renderComps.length; i++){
  var renderComp = renderComps[i];
  var finalVideoLayer = getLayerIncludingName(renderComp, 'Final');
  renderComp.duration = finalVideoLayer.outPoint - finalVideoLayer.inPoint;
  trimLayersToComp(renderComps[i]);
}
// END: Trim all 'Render' composition layers and adjust internal layers to
// fit to the composition length. (E.g. for 720p & 1080p).

// Utility functions.
// Hex to RGB Method by dtasev: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgbs
function hexToNormalisedRGB(hex){
  hex = hex.substring(1, hex.length);
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;
  return [r/255, g/255, b/255];
}

function trimLayersToComp(composition, excludeLabel){
  for (var i = 1; i < composition.numLayers; i++){
          var layer = composition.layer(i);

          // If thel layer hasn't been marked with an 'Red' label, then we
          // set the layer length to that of the entire composition.
          if (excludeLabel && (layer.label === excludeLabel)) continue;

          // Set the inPoint to 0 so that the layer starts from the very beginning of the composition.
          layer.inPoint = 0;
          // Set the outPoint to be the entire duration of the composition.
          layer.outPoint = composition.duration;
  }
}

function getCompsIncludingName(name){
  var comps = [];
  for (var i = 1; i < app.project.numItems; i++){
    var comp = app.project.item(i);
    // Apply the following lines to compositions which only have the string 'Render'
    // in their name. (This will allow us to add higher res comps in the future, so
    // long as they are named with 'Render' in the composition title).
    if (comp.name.indexOf("Render") === -1) continue;
    comps.push(comp);
  }
  return comps;
}

function getLayerIncludingName(comp, name){
  for (var i = 1; i < comp.numLayers; i++){
    if (comp.layer(i).name.indexOf(name) !== -1) return comp.layer(i);
  }
}

function getPropertyByName(effect, name){
  for (var i = 1; i < effect.numProperties; i++){
    var property = effect.property(i);
    if (property.name === name) return property;
  }
}
