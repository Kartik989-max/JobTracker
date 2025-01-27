const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    CompanyName: {
        type: String,
        required: true
    },
    JobTitle: {
        type: String,
        required:true,
    },
    Status: {
        type: String,
        required:true,
    },
    AppliedDate: {
        type: String,
        required:true,
    },
    email:{
        type: String,
        required:true,
    },
})
const job = mongoose.model('job', jobSchema);
module.exports = job;