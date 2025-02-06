const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const natural = require("natural");

// Function to extract text from PDF/DOCX
const extractText = async (filePath) => {
    const fileExt = path.extname(filePath).toLowerCase();
    console.log('fileext',filePath);
    
    if (fileExt === ".pdf") {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    } else if (fileExt === ".docx") {
        const dataBuffer = fs.readFileSync(filePath);
        const result = await mammoth.extractRawText({ buffer: dataBuffer });
        return result.value;
    }
    return "";
};

// Function to calculate similarity using TF-IDF + Cosine Similarity
const calculateSimilarity = (resumeText, jobText) => {
    const tokenizer = new natural.WordTokenizer();
    const tfidf = new natural.TfIdf();

    tfidf.addDocument(tokenizer.tokenize(resumeText));
    tfidf.addDocument(tokenizer.tokenize(jobText));

    const resumeVector = [];
    const jobVector = [];

    tfidf.listTerms(0).forEach((term) => {
        resumeVector.push(term.tfidf);
        jobVector.push(tfidf.tfidf(term.term, 1) || 0);
    });

    const dotProduct = resumeVector.reduce((sum, val, i) => sum + val * jobVector[i], 0);
    const magnitudeA = Math.sqrt(resumeVector.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(jobVector.reduce((sum, val) => sum + val * val, 0));

    const similarity = magnitudeA && magnitudeB ? (dotProduct / (magnitudeA * magnitudeB)) * 100 : 0;
    return similarity.toFixed(2);
};

// Main function to analyze resume
const analyzeResume = async (resumeFilePath, jobDescriptionText) => {
    try {
        // Extract text from resume
        const resumeText = await extractText(resumeFilePath);
        console.log(resumeText);
        
        // Delete the uploaded file after processing
        fs.unlinkSync(resumeFilePath);

        if (!resumeText || !jobDescriptionText) {
            return { error: "Error extracting text from files" };
        }

        // Calculate ATS Score
        const atsScore = calculateSimilarity(resumeText, jobDescriptionText);
        return { atsScore, message: "Analysis complete" };
    } catch (error) {
        console.error("Error analyzing resume:", error);
        return { error: "Server error" };
    }
};

module.exports = analyzeResume;
