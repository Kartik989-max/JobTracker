chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "JOB_APPLICATION") {
        const jobData = message.data;

        // Send data to your backend
        fetch("http://localhost:5000/jobCreate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jobData)
        })
        .then(response => response.json())
        .then(data => console.log("Job saved successfully:", data))
        .catch(err => console.error("Error saving job:", err));
    }
});
