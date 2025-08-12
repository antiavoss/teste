const perguntas = [
  {
    pergunta: "Qual peça você prefere para um evento à noite?",
    opcoes: ["Vestido longo", "Macacão elegante", "Conjunto de alfaiataria"]
  },
  {
    pergunta: "Qual tecido mais te agrada?",
    opcoes: ["Seda", "Linho", "Crepe"]
  }
];

let respostas = [];
let perguntaAtual = 0;

function mostrarPergunta() {
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';
  if (perguntaAtual < perguntas.length) {
    const q = perguntas[perguntaAtual];
    const div = document.createElement('div');
    div.classList.add('question');
    div.innerHTML = `<h3>${q.pergunta}</h3>`;
    q.opcoes.forEach(op => {
      const btn = document.createElement('button');
      btn.textContent = op;
      btn.onclick = () => {
        respostas.push(op);
        perguntaAtual++;
        mostrarPergunta();
      };
      div.appendChild(btn);
    });
    container.appendChild(div);
  } else {
    mostrarResultado();
  }
}

function mostrarResultado() {
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = `<h2>Resumo do seu estilo:</h2>
    <p>Você escolheu: ${respostas.join(', ')}</p>
    <button onclick="refazerQuiz()">Refazer Quiz</button>`;
}

function refazerQuiz() {
  respostas = [];
  perguntaAtual = 0;
  mostrarPergunta();
}

mostrarPergunta();