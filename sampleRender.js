var autorender = require('./autorender');

const main = async () => {
  await autorender.render({projectName: 'myTestProj', songPath: './sampleProject/Swoosh.mp3'});
}

main();
