// ===============================
// FUO TEST DRILLER
// ===============================


// CURRENT STATE

let currentCourse = "";
let currentMode = "";
let currentTopic = "";

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let userAnswers = [];

let timer;
let timeLeft = 600;


// ===============================
// QUESTION DATABASE
// ===============================

const questions = {

    "MTH 101": [

        {
            topic: "Algebra",
            question: "If 2x + 4 = 10, what is the value of x?",
            options: ["2", "3", "4", "5"],
            answer: 1
        },

        {
            topic: "Algebra",
            question: "Simplify: 3x + 2x.",
            options: ["5", "5x", "6x", "x"],
            answer: 1
        },

        {
            topic: "Indices",
            question: "What is 2³?",
            options: ["6", "8", "9", "12"],
            answer: 1
        },

        {
            topic: "Sets",
            question: "Which symbol represents the union of two sets?",
            options: ["∩", "∪", "⊂", "∈"],
            answer: 1
        },

        {
            topic: "Functions",
            question: "If f(x) = x + 3, find f(2).",
            options: ["3", "4", "5", "6"],
            answer: 2
        }

    ],


    "PHY 101": [

        {
            topic: "Motion",
            question: "What is the SI unit of velocity?",
            options: [
                "m/s",
                "kg",
                "N",
                "J"
            ],
            answer: 0
        },

        {
            topic: "Motion",
            question: "Which quantity is a scalar?",
            options: [
                "Velocity",
                "Acceleration",
                "Displacement",
                "Speed"
            ],
            answer: 3
        },

        {
            topic: "Forces",
            question: "What is the SI unit of force?",
            options: [
                "Joule",
                "Newton",
                "Watt",
                "Pascal"
            ],
            answer: 1
        },

        {
            topic: "Energy",
            question: "What is the SI unit of energy?",
            options: [
                "Newton",
                "Watt",
                "Joule",
                "Volt"
            ],
            answer: 2
        }

    ],


    "CHEM 101": [

        {
            topic: "Atomic Structure",
            question: "Which particle has a negative charge?",
            options: [
                "Proton",
                "Neutron",
                "Electron",
                "Nucleus"
            ],
            answer: 2
        },

        {
            topic: "Atomic Structure",
            question: "Which particle has no electrical charge?",
            options: [
                "Electron",
                "Proton",
                "Neutron",
                "Ion"
            ],
            answer: 2
        },

        {
            topic: "Periodic Table",
            question: "What is the atomic number of hydrogen?",
            options: [
                "1",
                "2",
                "7",
                "8"
            ],
            answer: 0
        },

        {
            topic: "Matter",
            question: "Which state of matter has a definite volume but no definite shape?",
            options: [
                "Solid",
                "Liquid",
                "Gas",
                "Plasma"
            ],
            answer: 1
        }

    ]

};


// ===============================
// PAGE CONTROL
// ===============================

function hideAllPages() {

    document.querySelectorAll(".page").forEach(function(page) {
        page.classList.add("hidden");
    });

}


function showPage(pageId) {

    hideAllPages();

    document.getElementById(pageId).classList.remove("hidden");

    window.scrollTo(0, 0);

}


function goHome() {

    clearInterval(timer);

    showPage("homePage");

}


// ===============================
// COURSE
// ===============================

function openCourse(course) {

    currentCourse = course;

    document.getElementById("courseTitle").textContent = course;

    createTopics();

    showPage("coursePage");

}


function createTopics() {

    const container =
        document.getElementById("topicsContainer");

    container.innerHTML = "";

    let courseQuestions = questions[currentCourse];

    let topics = [];

    courseQuestions.forEach(function(question) {

        if (!topics.includes(question.topic)) {
            topics.push(question.topic);
        }

    });


    topics.forEach(function(topic) {

        let button = document.createElement("button");

        button.className = "topic-button";

        button.textContent = topic;

        button.onclick = function() {
            startTopicPractice(topic);
        };

        container.appendChild(button);

    });

}


// ===============================
// START PRACTICE
// ===============================

function startGeneralPractice() {

    currentMode = "Practice";

    currentTopic = "";

    startQuiz();

}


function startTopicPractice(topic) {

    currentMode = "Topic Practice";

    currentTopic = topic;

    startQuiz();

}


function startExam() {

    currentMode = "Exam";

    currentTopic = "";

    startQuiz();

}


// ===============================
// START QUIZ
// ===============================

function startQuiz() {

    currentQuestionIndex = 0;

    score = 0;

    selectedAnswer = null;

    userAnswers = [];

    timeLeft = currentMode === "Exam" ? 600 : 900;

    document.getElementById("quizCourse").textContent =
        currentCourse;

    document.getElementById("quizMode").textContent =
        currentMode;

    startTimer();

    showPage("quizPage");

    displayQuestion();

}


// ===============================
// GET QUESTIONS
// ===============================

function getCurrentQuestions() {

    let courseQuestions = questions[currentCourse];

    if (currentTopic !== "") {

        return courseQuestions.filter(function(question) {

            return question.topic === currentTopic;

        });

    }

    return courseQuestions;

}


// ===============================
// DISPLAY QUESTION
// ===============================

function displayQuestion() {

    let quizQuestions = getCurrentQuestions();

    let question = quizQuestions[currentQuestionIndex];

    if (!question) {

        finishQuiz();

        return;

    }


    selectedAnswer = null;

    document.getElementById("questionNumber").textContent =
        currentQuestionIndex + 1;

    document.getElementById("totalQuestions").textContent =
        quizQuestions.length;

    document.getElementById("questionText").textContent =
        question.question;


    let optionsContainer =
        document.getElementById("optionsContainer");

    optionsContainer.innerHTML = "";


    question.options.forEach(function(option, index) {

        let button = document.createElement("button");

        button.className = "option";

        button.textContent =
            String.fromCharCode(65 + index) + ". " + option;

        button.onclick = function() {

            selectAnswer(index, button);

        };

        optionsContainer.appendChild(button);

    });


    let progress =
        ((currentQuestionIndex) / quizQuestions.length) * 100;

    document.getElementById("progress").style.width =
        progress + "%";


    document.getElementById("nextButton").textContent =
        currentQuestionIndex === quizQuestions.length - 1
        ? "Submit Test"
        : "Next Question";

}


// ===============================
// SELECT ANSWER
// ===============================

function selectAnswer(index, button) {

    selectedAnswer = index;

    document.querySelectorAll(".option").forEach(function(option) {

        option.classList.remove("selected");

    });

    button.classList.add("selected");

}


// ===============================
// NEXT QUESTION
// ===============================

function nextQuestion() {

    let quizQuestions = getCurrentQuestions();

    if (selectedAnswer === null) {

        alert("Please select an answer first.");

        return;

    }


    let question = quizQuestions[currentQuestionIndex];


    userAnswers.push({

        question: question.question,

        options: question.options,

        correctAnswer: question.answer,

        userAnswer: selectedAnswer

    });


    if (selectedAnswer === question.answer) {

        score++;

    }


    currentQuestionIndex++;

    displayQuestion();

}


// ===============================
// TIMER
// ===============================

function startTimer() {

    clearInterval(timer);

    updateTimerDisplay();


    timer = setInterval(function() {

        timeLeft--;

        updateTimerDisplay();


        if (timeLeft <= 0) {

            clearInterval(timer);

            finishQuiz();

        }

    }, 1000);

}


function updateTimerDisplay() {

    let minutes =
        Math.floor(timeLeft / 60);

    let seconds =
        timeLeft % 60;

    seconds =
        seconds < 10 ? "0" + seconds : seconds;

    document.getElementById("timer").textContent =
        minutes + ":" + seconds;

}


// ===============================
// FINISH QUIZ
// ===============================

function finishQuiz() {

    clearInterval(timer);

    let quizQuestions = getCurrentQuestions();

    let total = quizQuestions.length;

    let percentage =
        Math.round((score / total) * 100);


    document.getElementById("scorePercentage").textContent =
        percentage + "%";

    document.getElementById("scoreText").textContent =
        score + " / " + total;

    document.getElementById("correctAnswers").textContent =
        score;

    document.getElementById("wrongAnswers").textContent =
        total - score;


    if (percentage >= 70) {

        document.getElementById("resultMessage").textContent =
            "Good work! Keep practicing and aim even higher.";

    } else if (percentage >= 50) {

        document.getElementById("resultMessage").textContent =
            "Fair attempt. More practice will help you improve.";

    } else {

        document.getElementById("resultMessage").textContent =
            "Keep studying and practicing. You can improve.";

    }


    showPage("resultPage");

}


// ===============================
// REVIEW
// ===============================

function reviewAnswers() {

    let container =
        document.getElementById("reviewContainer");

    container.innerHTML = "";


    userAnswers.forEach(function(item, index) {

        let isCorrect =
            item.userAnswer === item.correctAnswer;


        let div = document.createElement("div");

        div.className =
            "review-item " +
            (isCorrect ? "correct" : "wrong");


        div.innerHTML = `

            <h3>Question ${index + 1}</h3>

            <p>
                <strong>${item.question}</strong>
            </p>

            <p>
                Your answer:
                ${item.options[item.userAnswer]}
            </p>

            <p>
                Correct answer:
                ${item.options[item.correctAnswer]}
            </p>

        `;


        container.appendChild(div);

    });


    showPage("reviewPage");

}


// ===============================
// EXIT
// ===============================

function confirmExit() {

    let leave =
        confirm(
            "Are you sure you want to leave this test?"
        );

    if (leave) {

        clearInterval(timer);

        goHome();

    }

}