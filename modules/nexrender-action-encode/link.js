const path = require('path');
const { exec } = require('child_process');

exec(`npm link`, {
  cwd: path.resolve(__dirname)
}, (err, stdout, stderr) => console.log(err, stdout, stderr));

exec(`npm link nexrender-action-encode`, {
  cwd: path.resolve(__dirname, '../../')
}, (err, stdout, stderr) => console.log(err, stdout, stderr));
