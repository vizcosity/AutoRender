var autorender = require('./autorender');

const main = async () => {
  await autorender.render({projectName: 'myTestProj'});
}

main();
