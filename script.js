const questions = [
    {
        question: "What is blockchain technology primarily used for?",
        choices: ["Decentralized data management", "Gaming", "Social networking"],
        correctChoice: 0
    },
    {
        question: "Which of the following is considered the first decentralized cryptocurrency?",
        choices: ["Ethereum", "Litecoin", "Bitcoin"],
        correctChoice: 2
    },
    {
        question: "What is the primary purpose of EDU Chain?",
        choices: ["Providing decentralized education resources", "Facilitating financial transactions", "Social media networking"],
        correctChoice: 0
    },
    {
        question: "Open Campus Codex is a network designed to support what industry?",
        choices: ["Healthcare", "Education", "Retail"],
        correctChoice: 1
    },
    {
        question: "Which platform is known for organizing global hackathons and supporting Web3 innovation?",
        choices: ["GitHub", "Dorahacks", "Stack Overflow"],
        correctChoice: 1
    },
    {
        question: "Animoca Brands is primarily associated with which sector?",
        choices: ["Automobile industry", "Blockchain gaming and metaverse", "Pharmaceuticals"],
        correctChoice: 1
    },
    {
        question: "ForbesWeb3 is a platform dedicated to covering news and analysis in what area?",
        choices: ["Artificial Intelligence", "Blockchain and Web3", "Cloud Computing"],
        correctChoice: 1
    },
    {
        question: "TinyTap uses blockchain technology for what purpose?",
        choices: ["Creating and monetizing educational content", "Real estate transactions", "Online gaming"],
        correctChoice: 0
    },
    {
        question: "ApeCoin is primarily used for what within its ecosystem?",
        choices: ["Governance and rewards within decentralized applications", "Medical data storage", "Logistics management"],
        correctChoice: 0
    },
    {
        question: "RiseIn is a platform that focuses on what aspect of education?",
        choices: ["Online tutoring", "Immersive learning experiences using VR", "University applications"],
        correctChoice: 1
    },
    {
        question: "NewCampus aims to provide what type of educational experiences?",
        choices: ["Traditional classroom learning", "Immersive learning for working professionals", "Children's online courses"],
        correctChoice: 1
    },
    {
        question: "HackQuest is known for what type of activity?",
        choices: ["Blockchain coding challenges", "Stock trading", "Virtual event hosting"],
        correctChoice: 0
    }
];

let currentQuestion = 0;
let score = 0;

const quizContainer = document.querySelector(".quiz-container");
const questionNumberElement = document.getElementById("question-number");
const questionTextElement = document.getElementById("question-text");
const choicesElement = document.getElementById("choices");
const scoreElement = document.getElementById("score");

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleArray(questions);

function showQuestion(questionIndex) {
    const question = questions[questionIndex];
    questionNumberElement.textContent = `Question ${questionIndex + 1}`;
    questionTextElement.textContent = question.question;

    choicesElement.innerHTML = "";
    for (let i = 0; i < question.choices.length; i++) {
        const choiceButton = document.createElement("button");
        choiceButton.className = "choice";
        choiceButton.textContent = question.choices[i];
        choiceButton.onclick = () => checkAnswer(i);
        choicesElement.appendChild(choiceButton);
    }

    quizContainer.style.opacity = 1;
    quizContainer.style.backgroundColor = "#f9f9f9";
}

function showEndMessage() {
    quizContainer.innerHTML = `
        <p>You've come to the end of the limited version.</p>
        <p>If you want to try the premium version, <a href="premium.html">click here</a></p>
    `;
    quizContainer.style.opacity = 1;
    quizContainer.style.backgroundColor = "#f9f9f9";
}

function checkAnswer(choiceIndex) {
    const question = questions[currentQuestion];
    const choiceButtons = choicesElement.querySelectorAll(".choice");
    choiceButtons.forEach(button => {
        button.disabled = true;
    });

    if (choiceIndex === question.correctChoice) {
        score++;
        scoreElement.textContent = `Score: ${score}`;
        choiceButtons[choiceIndex].style.backgroundColor = "green";
    } else {
        choiceButtons[choiceIndex].style.backgroundColor = "red";
        choiceButtons[question.correctChoice].style.backgroundColor = "green";
    }

    setTimeout(() => {
        quizContainer.style.opacity = 0.7;
        quizContainer.style.backgroundColor = "rgba(249, 249, 249, 0.7)";

        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < 4) {
                showQuestion(currentQuestion);
            } else {
                showEndMessage();
            }
        }, 1000);
    }, 50);
}

showQuestion(currentQuestion);

function reportQuestion() {
    const reportButton = document.querySelector(".report-button");
    const checkMark = document.getElementById("check-mark");

    reportButton.style.backgroundColor = "red";
    checkMark.style.visibility = "visible";
    checkMark.style.opacity = 1;
    checkMark.style.transform = "scale(1)";

    setTimeout(() => {
        reportButton.style.backgroundColor = "black";
        checkMark.style.visibility = "hidden";
        checkMark.style.opacity = 0;
        checkMark.style.transform = "scale(0.8)";
    }, 2000);
}
