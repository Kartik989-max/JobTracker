import React, { useState } from "react";
import axios from "axios";

const Analyser: React.FC = () => {
    const [resume, setResume] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState<string>("");
    const [score, setScore] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setResume(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!resume || !jobDescription.trim()) {
            alert("Please upload a resume and enter a job description.");
            return;
        }

        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("jobDescription", jobDescription);

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/analyzeResume",formData,{ headers: { "Content-Type": "multipart/form-data" } });
            console.log('og');
            

            setScore(response.data["ATS Score"]);
        } catch (error) {
            console.error("Error analyzing resume:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Job Application Analyzer</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" name="resume" accept=".pdf,.docx" onChange={handleFileChange} required />
                <textarea
                    rows={5}
                    placeholder="Paste job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    required
                />
                <button type="submit">Analyze</button>
            </form>
            {loading && <p>Analyzing...</p>}
            {score !== null && <h3>ATS Score: {score}%</h3>}
        </div>
    );
};

export default Analyser;
