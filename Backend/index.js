require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require("./models/user");
const mongoose = require("mongoose");
const app = express();
const port = 5000;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secretKey = process.env.JWT_SECRET_KEY;
const job = require("./models/job");
const fetchJob = require("./service/fetch_job");
const multer = require('multer');
const analyzeResume = require('./service/job_analyser')
const path=require('path');
// Middleware
app.use(cors());
app.use(bodyParser.json());

//Connect to database
const uri = process.env.MONGODB_URL;
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

connectToMongoDB();
// Endpoint to handle login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }
    console.log("Received login data:", email, password);

    const FindUser = await User.findOne({ email });
    if (!FindUser) {
      console.log("User Not Found");
      res.status(400).send({ message: "Crediential Dont Match" });
    } else {
      const isValidPassword = await bcrypt.compare(password, FindUser.password);

      if (FindUser && isValidPassword) {
        const token = jwt.sign({ id: FindUser._id }, secretKey, {
          expiresIn: "1h",
        });
        console.log("Login SuccessFul", email, password, token);
        res.status(200).send({
          message: "Login successful!",
          token,
          user: {
            id: FindUser._id,
            username: FindUser.username,
            email: FindUser.email,
          },
        });
      } else {
        console.log("Wrong Crediential");
        res.status(400).send({ message: "Wrong Credientials" });
      }
    }
  } catch (error) {
    console.error("Error during Login:", error);
    res.status(500).send({ message: "Login failed!" });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Recieved signup data:", username, email, password);
    if (!username || !email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    // Generate a JWT token
    const token = jwt.sign({ id: newUser._id }, secretKey, { expiresIn: "1h" });

    console.log("User created:", newUser);
    res.status(201).send({
      message: "SignUp successful!",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send({ message: "SignUp failed!" });
  }
});
app.post("/logout", (req, res) => {});

app.get("/displayJob", async (req, res) => {
  const userEmail = req.query.email;
  console.log("Fetching jobs for user:", userEmail);
  try {
    const jobs = await job.find({ email: userEmail });
    res.status(200).send(jobs);
  } catch (error) {
    console.error("Error during fetching jobs:", error);
    res.status(500).send({ message: "Failed to fetch jobs" });
  }
});

app.delete("/deleteJob", async (req, res) => {
  const jobId = req.query.id;
  console.log("Deleting job with id:", jobId);
  try {
    const jobToDelete = await job.findOne({ _id: jobId });
    if (!jobToDelete) {
      return res
        .status(404)
        .send({
          message:
            "Job not found or you don't have permission to delete this job",
        });
    }
    await job.findByIdAndDelete(jobId);
    res.status(201).send({ message: "Job Deleted" });
  } catch (error) {
    console.error("Error during job deletion:", error);
    res.status(500).send({ message: "Failed to delete job" });
  }
});

app.put('/editJob/:id', async (req, res) => {
  const {id} = req.params;
  const { CompanyName, JobTitle, Status, AppliedDate, email } = req.body;
  console.log("Received Job Data:", id, CompanyName, JobTitle, Status, AppliedDate);
  try {
    if (!CompanyName || !JobTitle || !Status || !AppliedDate) {
      return res.status(400).send({ message: "All fields are required" });
    }
    const jobToUpdate = await job.findOne({ _id: id });
    if (!jobToUpdate) {
      return res
        .status(404)
        .send({
          message:
            "Job not found or you don't have permission to update this job",
        });
    }
    await job.findByIdAndUpdate(id, {
      CompanyName,JobTitle,Status,AppliedDate},{new:true}
    );
    res.status(201).send({ message: "Job Updated" });
  } catch (error) {
    console.error("Error during job update:", error);
    res.status(500).send({ message: "Job Update failed" });
  }
});


app.post("/jobCreate", async (req, res) => {
  const { CompanyName, JobTitle, Status, AppliedDate, email } = req.body;
  console.log("Received Job Data:", CompanyName, JobTitle, Status, AppliedDate, email);
  try {
    if (!CompanyName || !email || !JobTitle || !Status || !AppliedDate) {
      return res.status(400).send({ message: "All fields are required" });
    }
    job.create({
      CompanyName,JobTitle,Status,AppliedDate,email,
    });
    res.status(201).send({ message: "Job Created" });
  } catch (error) {
    console.error("Error during job creation:", error);
    res.status(500).send({ message: "Job Creation failed" });
  }
});

app.post('/recommendedJob',async (req,res)=>{
  const {position,location,jobType}=req.body;
  console.log(req.body);
  
  const recommendJobs =await fetchJob(position,location,jobType);
  try {
    if(recommendJobs.length>0){
      console.log('fetched job');  
      // res.status(200).json(recommendJobs);
      const token = jwt.sign({ position:position }, secretKey,{expiresIn:'1h'});
      res.status(200).send({recommendJobs,token,preferenceJobs:{
        position:position,
      }});
    }
    else{
      console.log('No job Found');
      res.status(404).json({message:'No job Found'});
    }
  } catch (error) {
    console.log('Error in fetching jobs:',error);
    res.status(400).json({message:'Error in fetching job'})  
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "uploads/"); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
      // Save with original name and extension
      cb(null, Date.now() + path.extname(file.originalname)); // Adds timestamp to the original file name
  }
});

const upload = multer({ storage: storage });

// API to analyze resume (file) & job description (text)
app.post("/analyzeResume", upload.single("resume"), async (req, res) => {  
    try {
        const resumeFile = req.file;
        
        const jobDescriptionText = req.body.jobDescription; // Job description as text
        console.log(resumeFile.path);
        
        if (!resumeFile || !jobDescriptionText) {
            return res.status(400).json({ message: "Resume file and job description text are required" });
        }

        const result = await analyzeResume(resumeFile.path, jobDescriptionText);
        console.log(result);
        
        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        res.json({ "ATS Score": result.atsScore, message: result.message });
    
    }
     catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});





app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

