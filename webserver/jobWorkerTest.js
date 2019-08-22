var { Job, JobWorker, JobQueue, JobManager } = require('./modules/JobManager');

var queue = new JobQueue();

var job = new Job({
  projectName: 'jobWorkerRenderTest',
  songPath: '../sampleProject/ShortSound.mp3',
  songName: 'Sad Machine',
  artistName: 'Porter Robinson',
  genre: 'Progressive House',
  visualizerColour: '#c7254e'
});

var worker = new JobWorker(queue, {pollingRate: 5000});

queue.enqueue(job);
