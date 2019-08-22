var autorender = require('./autorender');

const main = async () => {
  await autorender.render({
    projectName: 'myTestProj',
    songDetails: {
      songPath: '../sampleProject/ShortTrack.mp3',
      songName: 'Sad Machine',
      artistName: 'Porter Robinson',
      genre: 'Progressive House',
      visualizerColour: '#c7254e'
    }
  });
}

main();
