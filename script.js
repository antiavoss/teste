
const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');

const myQuestions = [
    {
        question: "Se você fosse uma frequência, qual escolheria vibrar?",
        answers: {
            a: "432Hz – Harmonia e cura",
            b: "528Hz – Transformação e milagres",
            c: "963Hz – Conexão cósmica"
        },
        correctAnswer: "a"
    },
    {
        question: "Qual símbolo mais ressoa com sua essência agora?",
        answers: {
            a: "Círculo – Unidade",
            b: "Triângulo – Expansão",
            c: "Espiral – Evolução"
        },
        correctAnswer: "c"
    },
    {
        question: "Se o universo lhe enviasse uma mensagem hoje, ela viria como...",
        answers: {
            a: "Uma visão",
            b: "Um som",
            c: "Uma sensação física"
        },
        correctAnswer: "b"
    }
];

function buildQuiz(){
    const output = [];
    myQuestions.forEach((currentQuestion, questionNumber) => {
        const answers = [];
        for(letter in currentQuestion.answers){
            answers.push(
                `<label>
                    <input type="radio" name="question${questionNumber}" value="${letter}">
                    ${letter} :
                    ${currentQuestion.answers[letter]}
                </label>`
            );
        }
        output.push(
            `<div class="question"> ${currentQuestion.question} </div>
            <div class="answers"> ${answers.join('')} </div>`
        );
    });
    quizContainer.innerHTML = output.join('');
}

function showResults(){
    const answerContainers = quizContainer.querySelectorAll('.answers');
    let numCorrect = 0;
    myQuestions.forEach((currentQuestion, questionNumber) => {
        const answerContainer = answerContainers[questionNumber];
        const selector = `input[name=question${questionNumber}]:checked`;
        const userAnswer = (answerContainer.querySelector(selector) || {}).value;
        if(userAnswer === currentQuestion.correctAnswer){
            numCorrect++;
            answerContainers[questionNumber].style.color = 'lightgreen';
        } else {
            answerContainers[questionNumber].style.color = 'red';
        }
    });
    resultsContainer.innerHTML = `${numCorrect} de ${myQuestions.length} respostas corretas.`;
}

buildQuiz();
submitButton.addEventListener('click', showResults);
