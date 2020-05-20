/**
 * The Job Manager provides facilitiy to manage queued render jobs.
 *
 * @ Aaron Baw 2019
 */

// Dependencies.
const path = require('path');
const fs = require('fs');
const rmrf = require('rimraf');
const glob = require('glob');
const autorender = require(path.resolve(__dirname, '../../autorender'));
const Datauri = require('datauri');
const fileType = require('file-type');
const moment = require('moment');
const winston = require('winston');

const datauri = new Datauri();



// Defaults / constants
const _POLLING_RATE = process.env.POLLING_RATE || (1000 * 30); // 30 seconds.

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
      // TODO: Check if the songFile is a path, or an actual file which should be
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
    this.status = 'pending';
    this.progress = -1;
    this.outputPath = null;
    this.outputFile = null;
    this.pathToSelf = null;
    this.failureReason = null;

    // Set timing information. When the state changes, the timing object is updated
    // as soon as the state is changed. To see when a certain state change took effect,
    // this would be accessed as this.timing[state].
    this.timing = {
      created: new Date(),
    }
  }

  static fromStoredState(job){
    let self = new Job(job.details);

    // self.id = job.id;
    // self.queued = job.queued;
    // self.status = job.status;
    // self.progress = job.progress;
    // self.outputPath = job.outputPath;
    // self.outputFile = job.outputFile;
    // self.pathToSelf = job.pathToSelf;
    // self.failureReason = job.failureReason;
    // self.timing = job.timing;

    // Ensure we are not leaving out any lingering properties.
    Object.keys(job).filter(key => key !== 'details').forEach(
      additionalKey => {
        self[additionalKey] = job[additionalKey];
      }
    )

    return self;
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

  prepareForCompletion(autorenderCompletionDetail, commitToDisk = true){

    try {
      this.outputPath = autorenderCompletionDetail.actions.postrender[0].output;
    } catch(e){
      this.log(`Could not set outputPath after completing job for`, job.id, `error:`, e);
    }

    // Attempt to write jobDetail file to .temp folder.
    // try {
    //   let tempFolder = path.resolve(this.outputPath, '.temp');
    //   this.commitStateToFile(tempFolder);
    //   this.log(`Committed`, this.id, `to file in`, tempFolder);
    // } catch (e){
    //   this.log(`Could not write completed jobDetail file to`, this.outputPath)
    // }

    // Set the 'pathToSelf' attribute so that the stateChange is written to disk,
    // and we can subsequently remove self from the queue it belongs to.
    if (commitToDisk) this.setPathToSelf();

    this.setStatus('completed');

  }

  prepareForFailure(e, doNotCommit){


    // Set the 'pathToSelf' attribute so that the stateChange is written to disk,
    // and we can subsequently remove self from the queue it belongs to.
    if (!doNotCommit) this.setPathToSelf();

    this.failureReason = e;
    this.setStatus('failed');
  }

  setPathToSelf(){
      // Do not set pathToSelf if it has already been set.
      if (this.pathToSelf) return;

      // Remember that the outputPath contains the actual render. We must go up a level.
      if (this.outputPath){
        let fullWritePath = path.resolve(this.outputPath, '../', '.temp', `${this.details.projectName}_jobDetail.json`);
        this.pathToSelf = fullWritePath;
      } else {
        // Construct the output path using the default autorender output path.
        let outputDir = autorender.configureDirectoryStructureSync(autorender.OUTPUT_PATH, this.details.projectName);
        this.log(`Obtanied outputDir`, outputDir);
        let fullWritePath = path.resolve(outputDir, `${this.details.projectName}_jobDetail.json`);
        this.pathToSelf = fullWritePath;
      }

      this.log(`Set pathToSelf as`, this.pathToSelf);
  }

  setStatus(newStatus){

    log(`Setting status with pathToSelf`, this.pathToSelf);

    // Check if the job is in persistent storage. If so, we need to update the
    // job in storage.
    this.status = newStatus;

    if (this.pathToSelf) {
        // Overwrite previous preferences by writing to the same path that the
        // job itself exists at.
        this.commitStateToFile(this.pathToSelf);
    }

    // Update the timing information.
    this.timing[this.status] = new Date();

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

  commitStateToFile(dirPath){
    let writePath = path.resolve(dirPath);
    log(`Committing state of ${this.id} to path`, writePath);
    return fs.writeFileSync(writePath, this.serialiseJob({truncateBuffers: true}));
  }

  serialiseJob({truncateBuffers}){
    return JSON.stringify(
      truncateBuffers ? this.truncatedBuffers() : this,
      null,
      2
    );
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

    this._all = [];
    if (jobs) this.all = this.all.concat(jobs);

    this.retrieveFromStorage(autorender.OUTPUT_PATH);
  }

  get pending(){
    return [].concat(this.all.filter(job => job.status === 'pending'));
  }

  get rendering(){
    return [].concat(this.all.filter(job => job.status === 'rendering'));
  }

  get completed(){
    return [].concat(this.all.filter(job => job.status === 'completed'));
  }

  get failed(){
    return [].concat(this.all.filter(job => job.status === 'failed'));
  }

  get all(){
    // Concatenate at the point of retrieval so that we don't hold unnecesarily
    // large volumes of legacy renders in memory all the time, and we can keep
    // persistance.
    return this._all.concat(this.retrieveFromStorage(autorender.OUTPUT_PATH));
  }

  // Retrieves job details from persistent storage (e.g. completed jobs that are
  // no longer held in memory) and merges them with the existing jobs held in memory.
  retrieveFromStorage(outputPath, addToAllQueue){
    // Retrieve all jobDetail json files.
    return glob.sync(`${path.resolve(outputPath)}/*/.temp/*_jobDetail.json`)
    .map(jobDetailPath => {
      let jobJson = JSON.parse(fs.readFileSync(jobDetailPath));
      let storedJob = Job.fromStoredState(jobJson);

      // Add to the correct queue if it doesn't already exist.
      if (addToAllQueue && this._all.filter(job => job.id === storedJob.id).length === 0)
        this._all.push(storedJob);

      return storedJob;
    });
  }

  enqueue(job){

    if (this.all.filter(queuedJob => queuedJob.id == job.id).length >0)
    return this.log(`Attempted to queue job`, job.id, `which was already in queue.`);

    job = job.prepareForQueue();
    this._all.push(job);

    this.log(`Added`, job.id, `to the queue.`);

    return job;
  }

  dequeue(){

    // Check if there is anything to add in the queue.
    if (this.pending.length === 0) return null;

    let job = this.pending[0];

    job = job.prepareForDequeue();

    this.log(`Dequeueing`, job.id, `and moving to rendering queue [${this.rendering.length}]`);

    return job;
  }

  remove(id){

    let jobToRemove = this.getJobById(id);
    if (!jobToRemove) return false;

    if (jobToRemove.status == 'rendering') {
      this.log(`Attempting to remove job while render is in progress.`);
    }

    // Remove from storage if written to disk.
    // CHECKPOINT: For some reason, the path is null here.
    if (jobToRemove.pathToSelf) {
      // The job directory is located as the parent directory of the '.temp' folder used to contain the jobDetail json.
      let jobDirectory = path.resolve(path.dirname(jobToRemove.pathToSelf), '../');
      log(`Removing job at path:`, jobDirectory);
      this.log(`Removing job:`, id, `at path`, jobDirectory, `from disk.`);
      rmrf.sync(jobDirectory);
      this.log(`Removed`, jobDirectory, `from disk.`);

    }

    this._all = this._all.filter(job => job.id !== id);

    this.log(`Removed`, id, `from`, jobToRemove.status, `queue.`);

    this.cleanFromMemory();

    return jobToRemove;

  }

  completeJob({job, result, commitToDisk=true}){

    this.log(`Moving`, job.id, `to completed queue.`);

    if (job.status === 'completed') return;

    job.prepareForCompletion(result, commitToDisk);

    this.cleanFromMemory();

  }

  markFailed(job){

    this.log(`Moving`, job.id, `to failed queue.`);

    if (job.status === 'failed') return;

    job.prepareForFailure();

    this.cleanFromMemory();

  }

  getJobById(id){
    let matches = this.all.filter(job => job.id === id);

    return matches.length > 0 ? matches[0] : null;
  }

  // Removes jobs from memory that have a specified 'pathToSelf' attribute, indicating
  // that they are being held in persistent storage.
  cleanFromMemory(){
    let numJobs = this._all.length;
    log(`Jobs in memory:`, this._all);
    log(`Jobs with a 'pathToSelf attribute'`, this._all.filter(job => job.pathToSelf));
    this._all = this._all.filter(job => !job.pathToSelf);
    log(`Cleaned [${numJobs - this._all.length}] jobs from memory.`);
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

      // self.log(`Checking for jobs.`);

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
        songDetails: job.details,
        renderProgressHandler: job.updateProgress
      }).then(result => {

        self.log(`Finished rendering`, job.id, `with result:`, result);

        // Mark the job as completed.
        //job.prepareForCompletion(result);

        // Move the job from the active queue to the completed queue.
        self.queue.completeJob({job, result});

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


// Create the logger which will be used to output logs to the STDOUT stream
// as well as a logfile.
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  // defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'autorender.log' }),
    new winston.transports.Console(),
  ]
});

function log(...msg) {
  logger.info(`${moment().format("HH:MM")} JOB MANAGER ${msg.map(obj => require('util').inspect(obj)).join(' ')}`);
}
