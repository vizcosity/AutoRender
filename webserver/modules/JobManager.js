/**
 * The Job Manager provides facilitiy to manage queued render jobs.
 *
 * @ Aaron Baw 2019
 */

// Dependencies.
const path = require('path');
const autorender = require(path.resolve(__dirname, '../../autorender'));
const Datauri = require('datauri');
const fileType = require('file-type');

const datauri = new Datauri();

// Defaults / constants
const _POLLING_RATE = 1000 * 30; // 30 seconds.

/**
 * The JobDetail class captures all the informatin necessary to perform a render,
 * including the songName, file, and other assets. This exact class is used to
 * model the autorender script itself.
 * JobDetail {
   songName,
   songFile,
   genre,
   artistName,
   backgroundFile,
   visualizerColour
 }
 */
class JobDetail {
  constructor({
    projectName,
    songName,
    songFile,
    genre,
    artistName,
    artworkFile,
    backgroundFile,
    visualizerColour
  }){
    this.projectName = projectName;
    this.songName = songName;
    this.songFile = songFile;
    this.genre = genre;
    this.artistName = artistName;
    this.artworkFile = artworkFile;
    this.backgroundFile = backgroundFile;
    this.visualizerColour = visualizerColour;
  }

  // TODO: Add methods to search for appropriate background and visualizerColour.

}

class Job {
  constructor({
    id,
    projectName,
    songName,
    songFile,
    genre,
    artistName,
    artworkFile,
    backgroundFile,
    visualizerColour
  }){

    this.details = new JobDetail({
      projectName,
      songName,
      // TODO: Check if the songFile is a File, or an actual file which should be
      // encoded as a blob.
      songFile,
      artworkFile,
      genre,
      artistName,
      backgroundFile,
      visualizerColour
    });

    // Set once the Job is added to the JobQueue.
    this.id = id || null;
    this.queued = false;
    this.status = 'unqueued';
    this.progress = -1;
    this.outputPath = null;
    this.outputFile = null;
  }

  prepareForQueue(id){

    // Set the id if it has not been set already.
    if (!id) id = this.id || `${this.details.projectName}_${this.details.songName}`;

    // Only set the id of this current instance if it has not been set previously.
    if (!this.id) this.id = id;
    this.queued = true;
    this.setStatus('pending');
    return this;
  }

  prepareForDequeue(){
    this.queued = false;
    this.setStatus('rendering');
    return this;
  }

  prepareForCompletion(autorenderCompletionDetail){
    this.setStatus('completed');

    try {
      this.outputPath = autorenderCompletionDetail.actions.postrender[0].output;
    } catch(e){
      this.log(`Could not set outputPath after completing job for`, job.id, `error:`, e);
    }

  }

  prepareForFailure(e){
    this.setStatus('failed');
    this.failureReason = e;
  }

  setStatus(newStatus){
    this.status = newStatus;
  }

  updateProgress(newProgress){
    this.progress = newProgress;
  }

  getOutputFile(){
    if (this.status !== 'completed' || !this.outputPath)
      return this.log(`Attempted to get output file for uncompleted job`, this.status, this.outputPath);

    // Read the file from the output directory.
    return fs.readFileSync(this.outputPath);

  }

  truncatedBuffers(){
    // Create a copy of the job object so that we don't overwrite the buffered
    // files.
    let jobCopy = JSON.parse(JSON.stringify(this));

    // Replace buffered files with placeholder strings to reduce size of response.
    Object.keys(this.details).forEach(detailField => {
      let value = this.details[detailField];
      jobCopy.details[detailField] = value instanceof Buffer ? '<BufferedFile>' : value;
    });

    return jobCopy;
  }

  toString(){
    return this.id ? `Job { id: ${this.id} }` : this;
  }

  log(...msg){
    log(`[JOB]`, ...msg);
  }

}

class JobQueue {

  constructor(jobs){
    this.pending = [];
    this.active = [];
    this.completed = [];
    this.failed = [];

    if (jobs) this.pending = this.pending.concat(jobs);
  }

  all(){
    return this.pending.concat(this.active).concat(this.completed).concat(this.failed);
  }

  enqueue(job){

    job = job.prepareForQueue();
    this.pending.push(job);

    this.log(`Added`, job.id, `to the queue.`);

    return job;
  }

  dequeue(){

    // Check if there is anything to add in the queue.
    if (this.pending.length === 0) return null;

    let job = this.pending.shift();
    job = job.prepareForDequeue();
    this.active.push(job);

    this.log(`Dequeueing`, job.id, `and moving to active queue [${this.active.length}]`);

    return job;
  }

  remove(id){

    let jobToRemove = this.getJobById(id);
    if (!jobToRemove) return false;


    this.active = this.active.filter(job => job.id !== id);
    this.pending = this.pending.filter(job => job.id !== id);
    this.completed = this.completed.filter(job => job.id !== id);
    this.failed = this.failed.filter(job => job.id !== id);

    this.log(`Removed`, id, `from`, this.status, `queue.`);

    return jobToRemove;

  }

  completeJob(job){

    this.log(`Moving`, job.id, `to completed queue.`);

    if (this.active.filter(activeJob => activeJob.id === job.id).length !== 1)
      return this.log(`Job`,job.id, `not found in active queue.`);

    // Find the job in the queue, and move it.
    this.active = this.active.filter(activeJob => activeJob.id !== job.id);

    // Place the job in the 'completed' queue.
    this.completed.push(job);

  }

  markFailed(job){

    this.log(`Moving`, job.id, `to failed queue.`);

    if (this.active.filter(activeJob => activeJob.id === job.id).length !== 1)
      return this.log(`Job`,job.id, `not found in active queue.`);

    // Find the job in the queue, and move it.
    this.active = this.active.filter(job => job.id !== job.id);

    // Place the job in the 'completed' queue.
    this.failed.push(job);
  }

  getJobById(id){
    let matches = this.all().filter(job => job.id === id);

    return matches.length > 0 ? matches[0] : null;
  }

  log(...msg){
    log(`[QUEUE]`, ...msg);
  }

}

// Should be able to access all functionality from an instance of this class.
class JobManager {

  constructor(params){

    if (params)
      var {jobs, pollingRate} = params;

    this.queue = jobs ? new JobsQueue(jobs) : new JobQueue();
    this.worker = new JobWorker(this.queue, {pollingRate});

    this.log(`Initialised queue & worker.`);
  }

  log(...msg){
    log(`[MANAGER]`, ...msg);
  }

  enqueueJob(jobDetails){
    return this.queue.enqueue(new Job(jobDetails));
  }

  getJobById(id){
    return this.queue.getJobById(id);
  }

  getCompletedJobFilePath(id){
    let job = this.getJobById(id);
    return job ? job.outputPath : null;
  }

  getCompletedJobFile(id){
    let job = this.getJobById(id);
    return job ? job.getOutputFile() : null;
  }

  getCompletedJobDataURI(id){
    let fileBuffer = this.getCompletedJobFile(id);
    if (!fileBuffer) return null;

    try {

      // Grab the filetype.
      let jobFileType = fileType(fileBuffer).ext;

      this.log(`Determined job file type:`, jobFileType);

      // Encode the data as a base64 URI.
      let encodedBase64= datauri(jobFileType, fileBuffer.toString('base64'));



      return encodedBase64.content;

    } catch(e){
      this.log(`Could not convert job`, this.id, `to Base64 URI:`, e);
    }
  }

}

// This class actively listens for jobs added to a job queue through a polling
// mechanism, and runs jobs as and when they are added.
class JobWorker {

  constructor(queue, ops){
    this.pollingRate = ops && ops.pollingRate ? ops.pollingRate : _POLLING_RATE;
    this.queue = queue;
    this.listening = true;

    // Start the listener.
    this.listen();
  }

  // Constantly polls the queue to check for pending entries, running them and
  // then updating the queue when finished.
  listen(){

    this.listening = true;
    this.log(`Listening for jobs.`);

    let self = this;

    this.listenerProcess = setInterval(function(){

      if (!self.listening) {
        // self.log(`Waiting for current job to complete before dequeuing next job.`);
        return clearInterval(this.listenerProcess);
      }

      self.log(`Checking for jobs.`);

      // Pull latest job from the queue.
      var job = self.queue.dequeue();

      if (!job) return;

      self.log(`Pulled job off the queue:`, job);

      // Set listening to false for now (so that we only render one job at a time.).
      self.listening = false;

      // render the job by passing the 'details' to AutoRender.
      self.log(`Attempting to send job to autorender.`);

      // AutoRender.render takes in songDetails, projectName, and outputPath as
      // possible parameters.
      autorender.render({
        projectName: job.details.projectName,
        songDetails: job.details
      }).then(result => {

        self.log(`Finished rendering`, job.id, `with result:`, result);

        // Mark the job as completed.
        job.prepareForCompletion(result);

        // Move the job from the active queue to the completed queue.
        self.queue.completeJob(job);

        // Resume listening for new jobs.
        self.listening = true;
      })
      .catch(e => {
        self.log(`Error rendering`, job.id, `with error:`, e);

        job.prepareForFailure(e);

        self.queue.markFailed(job);

        // Resume listening for new jobs.
        self.listening = true;
      });

    }, this.pollingRate);

  }

  // Stops listening to changes in the queue and executing them.
  stopListening(){
    this.listening = false;
  }

  log(...msg){
    log(`[WORKER] `, ...msg);
  }

}

module.exports = {
  JobManager,
  JobQueue,
  JobWorker,
  Job
}

function log(...msg) {
  console.log(`JOB MANAGER`, ...msg);
}
