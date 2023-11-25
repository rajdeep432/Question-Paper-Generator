const express = require('express');
const { body, validationResult } = require('express-validator');
const i18n = require('i18n');

const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// i18n setup
i18n.configure({
    locales: ['en', 'es'], // Add more locales as needed
    directory: __dirname + '/locales',
    defaultLocale: 'en',
    cookie: 'locale'
});

// Middleware for i18n
app.use(i18n.init);

// Question store with the larger dataset
const questionStore = [
  {
      "question": "What is the speed of light?",
      "subject": "Physics",
      "topic": "Waves",
      "difficulty": "Easy",
      "marks": 5
  },
  {
      "question": "Explain the process of photosynthesis.",
      "subject": "Biology",
      "topic": "Ecology",
      "difficulty": "Medium",
      "marks": 10
  },
  {
      "question": "Solve the quadratic equation: ax^2 + bx + c = 0.",
      "subject": "Mathematics",
      "topic": "Algebra",
      "difficulty": "Medium",
      "marks": 8
  },
  {
      "question": "What is the capital of France?",
      "subject": "Geography",
      "topic": "Countries",
      "difficulty": "Easy",
      "marks": 5
  },
  {
      "question": "Explain the concept of gravity.",
      "subject": "Physics",
      "topic": "Forces",
      "difficulty": "Hard",
      "marks": 15
  },
  {
      "question": "Define the structure of a cell.",
      "subject": "Biology",
      "topic": "Cell Biology",
      "difficulty": "Medium",
      "marks": 10
  },
  {
      "question": "Solve the definite integral: ∫(2x + 3)dx from 0 to 5.",
      "subject": "Mathematics",
      "topic": "Calculus",
      "difficulty": "Hard",
      "marks": 12
  },
  {
      "question": "Name the largest desert in the world.",
      "subject": "Geography",
      "topic": "Landforms",
      "difficulty": "Easy",
      "marks": 5
  },
  {
      "question": "Who proposed the theory of relativity?",
      "subject": "Physics",
      "topic": "Modern Physics",
      "difficulty": "Medium",
      "marks": 10
  },
  {
      "question": "Explain the process of mitosis.",
      "subject": "Biology",
      "topic": "Cell Division",
      "difficulty": "Medium",
      "marks": 8
  },
  {
      "question": "Solve the system of linear equations: 2x + y = 5, 3x - 2y = 8.",
      "subject": "Mathematics",
      "topic": "Linear Algebra",
      "difficulty": "Hard",
      "marks": 12
  },
  {
      "question": "What are the major rivers in Asia?",
      "subject": "Geography",
      "topic": "Rivers",
      "difficulty": "Medium",
      "marks": 10
  },
  {
      "question": "Explain the concept of nuclear fission.",
      "subject": "Physics",
      "topic": "Nuclear Physics",
      "difficulty": "Hard",
      "marks": 15
  },
  {
      "question": "Describe the process of meiosis.",
      "subject": "Biology",
      "topic": "Cell Division",
      "difficulty": "Medium",
      "marks": 10
  },
  {
      "question": "Calculate the limit: lim(x->2) (x^2 - 4) / (x - 2).",
      "subject": "Mathematics",
      "topic": "Calculus",
      "difficulty": "Hard",
      "marks": 12
  },
  {
      "question": "What are the climate zones of the Earth?",
      "subject": "Geography",
      "topic": "Climate",
      "difficulty": "Easy",
      "marks": 5
  },
  {
      "question": "Who discovered penicillin?",
      "subject": "Biology",
      "topic": "Medicine",
      "difficulty": "Easy",
      "marks": 5
  },
  {
      "question": "Explain the concept of magnetic fields.",
      "subject": "Physics",
      "topic": "Magnetism",
      "difficulty": "Medium",
      "marks": 10
  },
  {
      "question": "Solve the logarithmic equation: log₂(x) = 3.",
      "subject": "Mathematics",
      "topic": "Logarithms",
      "difficulty": "Hard",
      "marks": 12
  },
  {
      "question": "What are the major mountain ranges in South America?",
      "subject": "Geography",
      "topic": "Mountains",
      "difficulty": "Medium",
      "marks": 10
  },
];

// Validation middleware for generating question paper
const validateGenerateQuestionPaper = [
    body('totalMarks').isInt({ min: 1 }).toInt(),
    body('difficultyDistribution').isObject(),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Continue to the next middleware if validation passes
        next();
    }
];

// Generate Question Paper route with input validation
app.post('/generate-question-paper', validateGenerateQuestionPaper, (req, res) => {
    const totalMarks = req.body.totalMarks;
    const difficultyDistribution = req.body.difficultyDistribution;

    // Generate question paper logic with the validated input
    const questionPaper = generateQuestionPaper(totalMarks, difficultyDistribution);

    // Translate the success message based on the user's locale
    const successMessage = res.__('questionPaperGenerated');

    // Format the output
    const formattedOutput = {
        success: true,
        message: successMessage,
        totalMarks,
        difficultyDistribution,
        questionPaper
    };

    // Handle the result as needed
    res.json(formattedOutput);
});

// Keep track of generated papers
const generatedPapers = [];

// Generate Question Paper
function generateQuestionPaper(totalMarks, difficultyDistribution) {
    const questionPaper = [];
    const selectedQuestions = {}; // Keep track of selected questions

    for (const difficultyLevel in difficultyDistribution) {
        const percentage = difficultyDistribution[difficultyLevel];
        const targetMarks = (totalMarks * percentage) / 100;

        const availableQuestions = questionStore.filter(question => question.difficulty === difficultyLevel && !selectedQuestions[question.question]);

        // Handle the case when there are not enough unique questions of the specified difficulty
        if (availableQuestions.length < targetMarks) {
            // Handle this case gracefully
            console.error(`Not enough unique questions of difficulty ${difficultyLevel}`);
            continue;
        }

        // Randomly select unique questions to meet the target marks
        while (targetMarks > 0) {
            const randomIndex = getRandomIndex(availableQuestions);
            const selectedQuestion = availableQuestions.splice(randomIndex, 1)[0];

            // Mark the selected question as used
            selectedQuestions[selectedQuestion.question] = true;

            questionPaper.push(selectedQuestion);
            targetMarks -= selectedQuestion.marks;
        }
    }

    // Check for uniqueness of the generated paper
    const paperHash = generatePaperHash(questionPaper);
    if (generatedPapers.includes(paperHash)) {
        // Regenerate the paper if it's not unique
        console.warn("Duplicate paper generated. Regenerating...");
        return generateQuestionPaper(totalMarks, difficultyDistribution);
    } else {
        // Store the paper hash for future reference
        generatedPapers.push(paperHash);
        return questionPaper;
    }
}

// Helper function to get a random index
function getRandomIndex(array) {
    return Math.floor(Math.random() * array.length);
}

// Helper function to generate a unique hash for a paper
function generatePaperHash(paper) {
    return JSON.stringify(paper);
}

// Example usage
const totalMarks = 100;
const difficultyDistribution = {
    "Easy": 20,
    "Medium": 50,
    "Hard": 30,
};

const generatedPaper1 = generateQuestionPaper(totalMarks, difficultyDistribution);
console.log("Paper 1:", generatedPaper1);

const generatedPaper2 = generateQuestionPaper(totalMarks, difficultyDistribution);
console.log("Paper 2:", generatedPaper2);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
