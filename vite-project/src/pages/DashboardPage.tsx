import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);
import Modal from "react-modal";
import Analyser from "@/components/Analyser/Analyser";
Modal.setAppElement("#root");

enum Status {
  Applied = "Applied",
  Interviewed = "Interviewed",
  Review = "Review",
}
interface JobCreateForm {
  CompanyName: string;
  JobTitle: string;
  Status: Status;
  AppliedDate: string;
}
interface Job {
  _id: string;
  CompanyName: string;
  JobTitle: string;
  Status: Status;
  AppliedDate: string;
  email: string;
}
enum jobType{
  partTime='Part Time',
  fullTime='Full Time',
}
interface JobPreferenceForm{
  position:string,
  location:string,
  jobType:jobType,
}
interface recommendedJobs{
  company: string;
  position: string;
  jobType: string;
  salary: number;
  jobUrl: string;
}
const DashboardPage: React.FC = () => {
  const [FormData, setFormData] = useState<JobCreateForm>({
    CompanyName: "",
    JobTitle: "",
    Status: Status.Applied,
    AppliedDate: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filterStatus, setFilterStatus] = useState<Status | "">("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  
  const username = user.username || "Guest";
  const [error, setError] = useState<string | null>(null);
  const userEmail = user.email || "Guest";
  const navigate = useNavigate();
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recommendedJobs, setRecommendedJobs]=useState<recommendedJobs[]>([]);
  const [isPreferenceModalOpen,setIsPreferenceModalOpen]=useState(false);
  const [preferenceData,setPreferenceData]=useState<JobPreferenceForm>({
    position:'',
    location:'',
    jobType:jobType.partTime,
  })

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/displayJob", {
        params: { email: userEmail },
      });
      setJobs(response.data);
      setIsLoading(false);
    } catch (err) {
      console.log("Error fetching jobs", err);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    // note this flag denote mount status
    let isMounted = true;
    if (isMounted) {
      fetchJobs();
    }
    return () => {
      isMounted = false; // Cleanup function to set the flag to false
    };
  }, [userEmail]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...FormData, [name]: value });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJobId(null);
    setFormData({
      CompanyName: "",
      JobTitle: "",
      Status: Status.Applied,
      AppliedDate: "",
    });
  };

  const handelEdit = async (job: Job) => {
    setFormData({
      CompanyName: job.CompanyName,
      JobTitle: job.JobTitle,
      Status: job.Status,
      AppliedDate: job.AppliedDate,
    });
    setEditingJobId(job._id);
    openModal();
  };
  const deleteJob = async (jobId: string) => {
    try {
      const response = await axios.delete("http://localhost:5000/deleteJob", {
        params: { id: jobId },
      });
      if (response.status === 201) {
        console.log("Job Deleted");
        toast.success("Job Deleted Successfully!");
        fetchJobs();
      }
    } catch (err) {
      console.log("Error", err);
      toast.error("Job Not Deleted!");
      setError("Failed to delete job'");
    }
  };

  const filteredJobs = filterStatus
    ? jobs.filter((job) => job.Status === filterStatus)
    : jobs;


  const showRecommendationJob = async (preference:JobPreferenceForm) => {

    try {
      const response = await axios.post("http://localhost:5000/recommendedJob", preference);
      if (response.status == 200) {
        localStorage.setItem('preferenceToken',response.data.token);
        localStorage.setItem('preferenceTokenData', JSON.stringify(preference));
        setRecommendedJobs(response.data.recommendJobs);
        console.log(response.data.recommendJobs);
        
        toast.success("Preferences saved successfully!");
      }
      
    } catch (error) {
      console.log(error);
      toast.error("Failed to save preference!");
    }
  };

 
    useEffect(() => {
      const prefercenToken = JSON.parse(localStorage.getItem("preferenceTokenData") || "{}");
      if(prefercenToken.position!= undefined){
        // setPreferenceData({
        //   position: prefercenToken.position,
        //   location: prefercenToken.location,
        //   jobType:jobType.fullTime,
        // });
        console.log(prefercenToken.position);
        showRecommendationJob(prefercenToken);
      }
       }, []);
 
  

  const handleJobSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingJobId) {
        const response = await axios.put(
          `http://localhost:5000/editJob/${editingJobId}`,
          FormData
        );
        if (response.status === 201) {
          toast.success("Job Updated Successfully");
          setEditingJobId(null);
          setTimeout(() => {
            closeModal();
            fetchJobs();
          }, 1000);
        }
      } else {
        const data = {
          ...FormData,
          email: userEmail,
        };
        const response = await axios.post(
          "http://localhost:5000/jobCreate",
          data
        );
        if (response.status === 201) {
          setTimeout(() => {
            fetchJobs();
          }, 500);
          setFormData({
            CompanyName: "",
            JobTitle: "",
            Status: Status.Applied,
            AppliedDate: "",
          });
          console.log("Job Created");
          toast.success("Job Created Successfully!");
        }
        console.log(FormData);
        closeModal();
      }
    } catch (err) {
      console.log("Error", err);
      toast.error("Job Not Created!");
      setError("Failed to create job");
    }
  };

  const handlePreferenceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPreferenceData({ ...preferenceData, [name]: value });
  };

  const openPreferenceModal = () => {
    setIsPreferenceModalOpen(true);
  };

  const closePreferenceModal = () => {
    setIsPreferenceModalOpen(false);
    setPreferenceData({
      position: "",
      location: "",
      jobType:jobType.fullTime,
    });
  };

  const handlePreferenceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showRecommendationJob(preferenceData);
    closePreferenceModal();
  };

  const jobCountsByDate = jobs.reduce((acc: { [key: string]: number }, job) => {
    acc[job.AppliedDate] = (acc[job.AppliedDate] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(jobCountsByDate),
    datasets: [
      {
        label: "Number of Jobs Applied",
        data: Object.values(jobCountsByDate),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  return (
    <div>
      <div>
        <h1>Hello, {username}</h1>
        <p>Dashboard</p>
        <h2>Create a Job application</h2>
        <form onSubmit={handleJobSubmit}>
          <Input
            value={FormData.CompanyName}
            onChange={handleChange}
            name="CompanyName"
            placeholder="Company Name"
          />
          <Input
            onChange={handleChange}
            name="JobTitle"
            value={FormData.JobTitle}
            placeholder="Job Title"
          />
          <Input
            onChange={handleChange}
            name="Status"
            value={FormData.Status}
            placeholder="Job Status"
          />
          <select
            name="Status"
            className="text-white"
            value={FormData.Status}
            onChange={handleChange}
          >
            <option value={Status.Applied}>Applied</option>
            <option value={Status.Interviewed}>Interviewed</option>
            <option value={Status.Review}>Review</option>
          </select>
          <Input
            onChange={handleChange}
            name="AppliedDate"
            value={FormData.AppliedDate}
            type="date"
            placeholder="Applied Date"
          />
          <Button type="submit">Submit</Button>
        </form>
        <Button onClick={handleLogout}>Logout</Button>
        <ToastContainer />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {/* Show jobs */}

      <div>
        <h3>Filter By Status:</h3>
        <select
          className="text-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as Status)}
        >
          <option value="">All</option>
          <option value={Status.Applied}>Applied</option>
          <option value={Status.Interviewed}>Interviewed</option>
          <option value={Status.Review}>Review</option>
        </select>
      </div>
      <div>
        {isLoading ? (
          <p>Loading jobs...</p>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job: Job, index: number) => (
            <div className="flex gap-2" key={index}>
              <h3>{job.CompanyName}</h3>
              <p>{job.JobTitle}</p>
              <p>{job.AppliedDate}</p>
              <p>{job.Status}</p>
              <button className="text-white" onClick={() => deleteJob(job._id)}>
                Delete
              </button>
              <button className="text-white" onClick={() => handelEdit(job)}>
                Edit
              </button>
            </div>
          ))
        ) : (
          <p>No jobs found</p>
        )}
      </div>

      <div>
        <h3>Jobs Applied Over Time</h3>
        <Bar data={chartData} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Job"
      >
        <h2>{editingJobId ? "Edit Job" : "Add Job"}</h2>
        <form onSubmit={handleJobSubmit}>
          <Input
            value={FormData.CompanyName}
            onChange={handleChange}
            name="CompanyName"
            placeholder="Company Name"
          />
          <Input
            onChange={handleChange}
            name="JobTitle"
            value={FormData.JobTitle}
            placeholder="Job Title"
          />
          <Input
            onChange={handleChange}
            name="Status"
            value={FormData.Status}
            placeholder="Job Status"
          />
          <select
            name="Status"
            className="text-white"
            value={FormData.Status}
            onChange={handleChange}
          >
            <option value={Status.Applied}>Applied</option>
            <option value={Status.Interviewed}>Interviewed</option>
            <option value={Status.Review}>Review</option>
          </select>
          <Input
            onChange={handleChange}
            name="AppliedDate"
            value={FormData.AppliedDate}
            type="date"
            placeholder="Applied Date"
          />
          <Button type="submit">{editingJobId ? "Edit Job" : "Add Job"}</Button>
        </form>
      </Modal>




{/* recommended Job  */}


        <Modal
        isOpen={isPreferenceModalOpen}
        onRequestClose={closePreferenceModal}
        contentLabel="Job Preference"
        >
          <h2>Job Preference</h2>
          <form onSubmit={handlePreferenceSubmit}>
            <Input value={preferenceData.position}
              onChange={handlePreferenceChange}
              name="position"
              placeholder="Job Position"
            />
          <Input
            value={preferenceData.location}
            onChange={handlePreferenceChange}
            name="location"
            placeholder="Location"
          />
          <Input
            value={preferenceData.jobType}
            onChange={handlePreferenceChange}
            name="jobType"
            placeholder="Job Type"
          />
          <select
            name="jobType"
            className="text-white"
            value={preferenceData.jobType}
            onChange={handlePreferenceChange}
          >
            <option value={jobType.fullTime}>Full Time</option>
            <option value={jobType.partTime}>Part Time</option>
          </select>
      <button type="submit" className="text-white" onClick={() => showRecommendationJob(preferenceData)}>Recomendtion</button>
          </form>
        </Modal>

        <Button onClick={openPreferenceModal}>Set Job Preferences</Button>

        
        <div>
        <h3>Recommended Jobs</h3>
        {recommendedJobs.length > 0 ? (
          recommendedJobs.map((job: recommendedJobs, index: number) => (
            <div className="flex gap-2" key={index}>
              <h3>{job.company}</h3>
              <p>{job.position}</p>
              <a href={`${job.jobUrl}`}>
              <button>Lol</button>
              </a>
              {/* <p>{job.jobUrl}</p> */}
              <p>{job.jobType}</p>

            </div>
          ))
        ) : (
          <p>No recommended jobs found</p>
        )}
      </div>
<Analyser/>

    </div>
  );
};

export default DashboardPage;
