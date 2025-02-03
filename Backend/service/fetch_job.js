const linkedIn = require('linkedin-jobs-api');


const fetchJob=async(keyword,location,jobType)=>{
  const queryOptions = {
    keyword: keyword,
    location:location,
    dateSincePosted: 'past Week',
    jobType: jobType,
    remoteFilter: 'remote',
    salary: '100000',
    experienceLevel: 'entry level',
    limit: '10',
    page: "0",
  };
  try{
    const response = await linkedIn.query(queryOptions);
    const uniqueJobs=await filterUniqueJobs(response);
    return uniqueJobs;
  }
  catch(error){
    console.log('Error in fetching recommended jobs',error);
    return [];
  }
    
};
const filterUniqueJobs=(jobs)=>{
  const seen=new Set();
  return jobs.filter(job=>{
    const identifier= `${job.company}-${job.position}`;
    const duplicate=seen.has(identifier);
    seen.add(identifier);
    return !duplicate;
  });
};

module.exports=fetchJob;