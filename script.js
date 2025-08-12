const questions = [
  {
    question: "Qual palavra mais ressoa com você?",
    options: ["Liderança", "Criatividade", "Romance", "Sabedoria"],
    archetypes: ["Soberana", "Visionária", "Romântica", "Eterna"]
  },
  {
    question: "Em um evento social, você...",
    options: [
      "Organiza tudo e garante que funcione bem",
      "Traz ideias novas e inesperadas",
      "Encanta com sua presença e charme",
      "Observa e compartilha conselhos valiosos"
    ],
    archetypes: ["Soberana", "Visionária", "Romântica", "Eterna"]
  },
  {
    question: "O que te motiva?",
    options: [
      "Conquistar objetivos",
      "Transformar ideias em realidade",
      "Construir relações profundas",
      "Buscar conhecimento"
    ],
    archetypes: ["Soberana", "Visionária", "Romântica", "Eterna"]
  },
  {
    question: "Se fosse uma cor, você seria...",
    options: ["Dourado", "Roxo", "Vermelho", "Azul-marinho"],
    archetypes: ["Soberana", "Visionária", "Romântica", "Eterna"]
  }
];

let currentQuestion = 0;
let scores = { Soberana: 0, Visionária: 0, Romântica: 0, Eterna: 0 };

const quizContainer = document.getElementById("quiz");
const nextBtn = document.getElementById("next-btn");
const resultContainer = document.getElementById("result");

function showQuestion() {
  const q = questions[currentQuestion];
  quizContainer.innerHTML = `
    <h2>${q.question}</h2>
    ${q.options.map((opt, index) => `
      <label>
        <input type="radio" name="answer" value="${q.archetypes[index]}">
        ${opt}
      </label><br>
    `).join("")}
  `;
}

nextBtn.addEventListener("click", () => {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) return alert("Escolha uma opção!");
  scores[selected.value]++;
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  const archetype = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );
  quizContainer.innerHTML = "";
  nextBtn.style.display = "none";
  resultContainer.innerHTML = `Seu arquétipo é: <strong>${archetype}</strong>`;
}

showQuestion();