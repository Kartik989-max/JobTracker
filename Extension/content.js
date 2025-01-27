// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SCRAPE_JOB_DATA") {
        try {
            // Scrape job data from the current page
            const JobTitle = document.querySelector(".profile")?.innerText || "Unknown"; // Update class
            const CompanyName = document.querySelector(".heading_6")?.innerText || "Unknown"; // Update class
            // const jobURL = window.location.href;

            // Package the scraped data
            const jobData = {
                JobTitle,
                CompanyName,
            };

            // Send the scraped data back to the popup
            sendResponse({ success: true, data: jobData });
        } catch (error) {
            console.error("Error scraping job data:", error);
            sendResponse({ success: false, error: error.message });
        }
        // Required to indicate asynchronous response
        return true;
    }
});
