var autorender = require('./autorender');
var fs = require('fs');

// const main = async () => {
//   await autorender.render({
//     projectName: 'myTestProj',
//     songDetails: {
//       songFile: './sampleProject/ShortTrack.mp3',
//       songName: 'Sad Machine',
//       artistName: 'Porter Robinson',
//       genre: 'Progressive House',
//       visualizerColour: '#c7254e'
//     }
//   });
// }
//

// Testing with buffers.
const main = async () => {
  await autorender.render({
    songDetails: {
      projectName: 'myShortTest',
      songFile: fs.readFileSync('./sampleProject/ShortSound.mp3'),
      artworkFile: fs.readFileSync('sampleProject/SampleArtwork.png'),
      songName: 'Sad Machine',
      artistName: 'Tester',
      backgroundFile: fs.readFileSync('./sampleProject/wilfried-santer-zelgyeLINKc-unsplash.jpg'),
      genre: 'Progressive House',
      visualizerColour: '#c7254e'
    }
  });
}

main();
