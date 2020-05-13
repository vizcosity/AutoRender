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

const cancelOrDeleteJob = async id => {
  fetch('/api/v1/job', {
    method: 'DELETE',
    body: JSON.stringify({
      id
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

const getLogs = async lines => {
  try {
    let result = await fetch('/api/v1/logs?lines='+lines, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    let resultJSON = await result.json();
    console.log('Fetched logs:', resultJSON);
    return resultJSON.log;
  } catch(e){
    return "Could not load logs. AutoRender API is probably down.";
  }
}

export {
  enqueueJob,
  getJobs,
  getJobDetail,
  getLogs,
  downloadJobResult,
  cancelOrDeleteJob
}
