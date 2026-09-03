const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dataFolder = path.join(__dirname, "data");
const filePath = path.join(dataFolder, "questions.json");

// Create data folder and file if they don't exist
if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
}

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
}

// Save a question
app.post("/api/questions", (req, res) => {
    const { question, marks, subject } = req.body;

    if (!question) {
        return res.status(400).json({
            success: false,
            message: "Question is required"
        });
    }

    const questions = JSON.parse(
        fs.readFileSync(filePath, "utf8")
    );

    const newQuestion = {
        id: Date.now(),
        question: question,
        marks: marks || "",
        subject: subject || "",
        createdAt: new Date().toISOString()
    };

    questions.push(newQuestion);

    fs.writeFileSync(
        filePath,
        JSON.stringify(questions, null, 2)
    );

    res.json({
        success: true,
        message: "Question saved successfully",
        question: newQuestion
    });
});

// Get all saved questions
app.get("/api/questions", (req, res) => {
    const questions = JSON.parse(
        fs.readFileSync(filePath, "utf8")
    );

    res.json(questions);
});

// Delete a question
app.delete("/api/questions/:id", (req, res) => {
    const questions = JSON.parse(
        fs.readFileSync(filePath, "utf8")
    );

    const updatedQuestions = questions.filter(
        q => q.id != req.params.id
    );

    fs.writeFileSync(
        filePath,
        JSON.stringify(updatedQuestions, null, 2)
    );

    res.json({
        success: true,
        message: "Question deleted"
    });
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
