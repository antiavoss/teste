document.getElementById('start-btn').addEventListener('click', startQuiz);

function startQuiz() {
    fetch('equiz_catalog.json')
    .then(response => response.json())
    .then(data => {
        let quizContainer = document.getElementById('quiz');
        quizContainer.innerHTML = '';
        data.questions.forEach((q, index) => {
            let questionElem = document.createElement('div');
            questionElem.innerHTML = `<h3>${q.question}</h3>`;
            q.options.forEach(opt => {
                let btn = document.createElement('button');
                btn.innerText = opt;
                btn.onclick = () => alert(`Você escolheu: ${opt}`);
                questionElem.appendChild(btn);
            });
            quizContainer.appendChild(questionElem);
        });
    });
}
