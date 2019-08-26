// REF: https://stackoverflow.com/questions/8135132/how-to-encode-url-parameters
const encodeGetParams = p =>
  p ? '?' + Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&") : "";

const enqueueJob = (jobDetails) => new Promise((resolve, reject) => {

  var formData = new FormData();

  Object.keys(jobDetails).forEach(field => {
    formData.append(field, jobDetails[field]);
  })

  fetch('/api/v1/queueJob', {
    method: 'POST',
    body: formData
  })
  .then(response => {
      try {
        return response.json();
      } catch(e) {
        reject(e);
      }
  })
  .then(response => resolve(response));

});

const getJobs = ops => new Promise((resolve, reject) => {

  fetch('/api/v1/jobs'+encodeGetParams(ops), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
      try {
        return response.json();
      } catch(e) {
        reject(e);
      }
  })
  .then(response => resolve(response));

});

const getJobDetail = ops => new Promise((resolve, reject) => {

  fetch('/api/v1/jobDetail'+encodeGetParams(ops), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
      try {
        return response.json();
      } catch(e) {
        reject(e);
      }
  })
  .then(response => resolve(response));

});

// This should automatically trigger a download.
const downloadJobResult = ops => {

  fetch('/api/v1/jobDetail'+encodeGetParams(ops), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

}

export {
  enqueueJob,
  getJobs,
  getJobDetail,
  downloadJobResult
}
