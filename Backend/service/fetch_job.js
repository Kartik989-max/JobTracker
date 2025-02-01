const linkedIn = require('linkedin-jobs-api');

const queryOptions = {
  keyword: 'software engineer',
  location: 'India',
  dateSincePosted: 'past Week',
  jobType: 'full time',
  remoteFilter: 'remote',
  salary: '100000',
  experienceLevel: 'entry level',
  limit: '10',
  page: "0",
};
const fetchJob=()=>{
    linkedIn.query(queryOptions).then(response => {
        console.log(response); 
        return response// An array of Job objects
    });
    
}
module.exports=fetchJob;