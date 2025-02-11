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
import Navbar from "@/components/ui/Navbar";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import Footer from "@/components/Footer/Footer";
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
enum jobType {
  partTime = "Part Time",
  fullTime = "Full Time",
}
interface JobPreferenceForm {
  position: string;
  location: string;
  jobType: jobType;
}
interface recommendedJobs {
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
  const [recommendedJobs, setRecommendedJobs] = useState<recommendedJobs[]>([]);
  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);
  const [preferenceData, setPreferenceData] = useState<JobPreferenceForm>({
    position: "",
    location: "",
    jobType: jobType.partTime,
  });

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

  const showRecommendationJob = async (preference: JobPreferenceForm) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/recommendedJob",
        preference
      );
      if (response.status == 200) {
        localStorage.setItem("preferenceToken", response.data.token);
        localStorage.setItem("preferenceTokenData", JSON.stringify(preference));
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
    const prefercenToken = JSON.parse(
      localStorage.getItem("preferenceTokenData") || "{}"
    );
    if (prefercenToken.position != undefined) {
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
      jobType: jobType.fullTime,
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
    <div className="bg-black text-center text-white">
      <Navbar />
      <ToastContainer />
      <h1 className="font-bold p-2">
        Hello,{" "}
        <span className="text-[#779ECB] "> {username.toUpperCase()} </span>
      </h1>
      <p className=" text-xl">Dashboard</p>

      <div className="flex justify-center gap-5 w-full py-6 px-8">
        {/* Job Application Form */}
        <div className="border-2 border-white rounded-xl p-6 h-fit w-1/2 bg-gray-900 text-white">
          <h2 className="text-2xl font-semibold text-center pb-6">
            Create a Job Application
          </h2>

          <form
            className="flex flex-col w-full gap-4"
            onSubmit={handleJobSubmit}
          >
            {/* Company Name */}
            <div className="grid grid-cols-3 items-center gap-2">
              <Label className="text-right text-lg font-semibold">
                Company Name{" "}
              </Label>
              <Input
                className="col-span-1 p-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
                value={FormData.CompanyName}
                onChange={handleChange}
                name="CompanyName"
                placeholder="Enter Company Name"
              />
            </div>

            {/* Job Title */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-right text-lg font-semibold">
                Job Title
              </Label>
              <Input
                className="col-span-1 w-full p-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
                value={FormData.JobTitle}
                onChange={handleChange}
                name="JobTitle"
                placeholder="Enter Job Title"
              />
            </div>

            {/* Job Status */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-right text-lg font-semibold">
                Job Status
              </Label>
              <div className="col-span-1 flex gap-2">
                <Input
                  className="w-full p-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={FormData.Status}
                  onChange={handleChange}
                  name="Status"
                  placeholder="Job Status"
                />
                <select
                  name="Status"
                  className="w-full p-2 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500"
                  value={FormData.Status}
                  onChange={handleChange}
                >
                  <option value={Status.Applied}>Applied</option>
                  <option value={Status.Interviewed}>Interviewed</option>
                  <option value={Status.Review}>Review</option>
                </select>
              </div>
            </div>

            {/* Applied Date */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <Label className="text-right text-lg font-semibold">
                Applied Date
              </Label>
              <Input
                className="col-span-1 w-full p-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
                value={FormData.AppliedDate}
                onChange={handleChange}
                name="AppliedDate"
                type="date"
                placeholder="Select Applied Date"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-min mx-auto mt-4 p-6 bg-[#779ECB] text-base font-bold rounded-md hover:bg-blue-700"
            >
              Submit
            </Button>
          </form>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </div>

        {/* Jobs Applied Chart */}
        <div className="bg-gray-800 text-white border-2 border-white p-6 w-1/3 rounded-xl">
          <h3 className="text-xl font-semibold text-center mb-4">
            Jobs Applied Over Time
          </h3>
          <Bar className="text-white" data={chartData} />
        </div>
      </div>

      <div className="pt-6 mx-10 flex flex-col items-center p-6">
        {/* Header */}
        <div className="w-full text-center">
          <h1 className="text-2xl font-bold text-white">Jobs Applied</h1>
        </div>

        {/* Filter Section */}
        <div className="flex items-center gap-4 p-4">
          <h3 className="text-white">Filter By Status:</h3>
          <select
            className="text-white bg-gray-800 border border-white px-3 py-1 rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Status)}
          >
            <option value="">All</option>
            <option value={Status.Applied}>Applied</option>
            <option value={Status.Interviewed}>Interviewed</option>
            <option value={Status.Review}>Review</option>
          </select>
        </div>

        {/* Table */}
        <div className="w-full">
          <div className="flex items-center justify-between bg-gray-900 mb-4 p-3   text-white font-bold border-b border-white">
            <p className="w-6">#</p>
            <p className="w-1/5">Company Name</p>
            <p className="w-1/5">Job Title</p>
            <p className="w-1/6">Applied Date</p>
            <p className="w-1/6">Status</p>
            <p className="w-1/6 text-center">Actions</p>
          </div>
          {/* Job List */}
          <div className="w-full space-y-2">
            {isLoading ? (
              <p className="text-white">Loading jobs...</p>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job: Job, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-800 p-3 rounded-lg border border-white text-white"
                >
                  <p className="w-6">{index + 1}</p>
                  <h3 className="w-1/5">{job.CompanyName}</h3>
                  <p className="w-1/5">{job.JobTitle}</p>
                  <p className="w-1/6">{job.AppliedDate}</p>
                  <p className="w-1/4">{job.Status}</p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-1 bg-red-600 rounded hover:bg-red-700"
                      onClick={() => deleteJob(job._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="px-4 py-1 bg-blue-600 rounded hover:bg-blue-700"
                      onClick={() => handelEdit(job)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white">No jobs found</p>
            )}
          </div>
        </div>
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
          <Input
            value={preferenceData.position}
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
          <button
            type="submit"
            className="text-white"
            onClick={() => showRecommendationJob(preferenceData)}
          >
            Recomendtion
          </button>
        </form>
      </Modal>

      <Button
        onClick={openPreferenceModal}
        className="bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        Set Job Preferences
      </Button>

      {/* Recommended Jobs Section */}
      <div className="mt-6 mx-10 bg-slate-700 border-2 border-white p-6 rounded-md text-white">
        <h3 className="text-2xl font-bold text-center mb-4">
          Recommended Jobs
        </h3>

        {/* Headings Row */}
        <div className="grid grid-cols-4 gap-4 border-b border-white pb-2 text-lg font-semibold">
          <p>#</p>
          <p>Company Name</p>
          <p>Job Description</p>
          <p>Apply</p>
        </div>

        {/* Jobs List */}
        {recommendedJobs.length > 0 ? (
          <div className="flex flex-col gap-3 mt-3">
            {recommendedJobs.map((job: recommendedJobs, index: number) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 border-b border-gray-500 py-2 items-center"
              >
                <p>{index + 1}</p>
                {/* Company Name */}
                <p className="font-medium">{job.company}</p>

                {/* Job Description */}
                <p className="text-gray-300">{job.position}</p>

                {/* Apply Button */}
                <a href={job.jobUrl} target="_blank" rel="noopener noreferrer">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition">
                    Apply
                  </button>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 mt-4">No recommended jobs found</p>
        )}
      </div>

      <Analyser />

      <Footer />
    </div>
  );
};

export default DashboardPage;
