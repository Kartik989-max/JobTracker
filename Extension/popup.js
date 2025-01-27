document.addEventListener("DOMContentLoaded", () => {
    const scrapeButton = document.getElementById("scrape-button");
    const emailInput = document.getElementById("email");
    const statusText = document.getElementById("status");

    // Add click event listener to the button
    scrapeButton.addEventListener("click", () => {
        // Send a message to the content script to scrape job data   
        const email = emailInput.value.trim();
        if (!email) {
            statusText.textContent = "Please enter your email.";
            return;
        }

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { type: "SCRAPE_JOB_DATA" }, (response) => {
                if (response && response.success) {
                    const jobData={
                        ...response.data,
                        email,
                        Status: "Applied",
                        AppliedDate: new Date().toISOString(), 
                    }

                    fetch('http://localhost:5000/jobCreate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(jobData),
                    })
                    .then(response => response.json())
                    .then((data)=>{
                        if(data.message==='Job Created'){
                            statusText.textContent="Job Data Send Successfully";
                            console.log('Job Created',data);
                        }
                        else{
                            statusText.textContent="Failed to send job data.";
                            console.log('Error:',data);
                        }
                    })
                    .catch((error)=>{
                        statusText.textContent='Failed to send job data.';
                        console.log('Failed to send job data',error);
                    })
                    statusText.textContent = "Job data scraped successfully!";
                    console.log("Scraped Data:", response.data);
                } else {
                    statusText.textContent = "Failed to scrape job data.";
                    console.error("Error:", response?.error || "No response from content script.");
                }
            });
        });
    });
});
