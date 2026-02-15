const chatArea = document.querySelector(".chat-area");
const input = document.querySelector("#chat-input");
const sendBtn = document.querySelector("#send-btn");
const progressBar = document.querySelector(".progress-bar-inner");

const questions = [
  "やっほー！まずは軽くいこう〜 最近『これ頑張ったな〜』って思う出来事ある？",
  "それってどんな状況だった？もうちょい詳しく教えて！",
  "その中で、あなたはどんな役割だったの？",
  "その時に“自分で工夫したこと”って何かあった？",
  "その工夫って、どんな結果につながった？",
  "その経験から『自分ってこういう人だな』って思ったポイントある？"
];

let currentStep = 0;
const answers = {
  episode: "",
  situation: "",
  role: "",
  action: "",
  result: "",
  learning: ""
};

function addMessage(text, sender = "bot") {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;
  chatArea.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function updateProgress() {
  const ratio = Math.min(currentStep / questions.length, 1);
  progressBar.style.width = `${ratio * 100}%`;
}

function askNextQuestion() {
  if (currentStep < questions.length) {
    addMessage(questions[currentStep], "bot");
    updateProgress();
  } else {
    generateDummyPR();
  }
}

function handleUserInput() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  saveAnswer(text);
  input.value = "";

  currentStep++;
  setTimeout(askNextQuestion, 400);
}

function saveAnswer(text) {
  switch (currentStep) {
    case 0:
      answers.episode = text;
      break;
    case 1:
      answers.situation = text;
      break;
    case 2:
      answers.role = text;
      break;
    case 3:
      answers.action = text;
      break;
    case 4:
      answers.result = text;
      break;
    case 5:
      answers.learning = text;
      break;
  }
}

function generateDummyPR() {
  updateProgress();
  addMessage("ナイス！今の内容で自己PRのたたき台をつくってみたよ👇", "bot");

  const prText = `
私は「${answers.episode}」に取り組んだ経験を通して、${answers.learning}という強みを身につけました。

この経験では、${answers.situation}という状況の中で、私は${answers.role}として行動しました。その中で特に意識したのは、${answers.action}という点です。

その結果、${answers.result}という成果につながりました。この経験から、私は${answers.learning}な人間であり、この強みを今後の環境でも発揮できると考えています。
  `.trim();

  const card = document.createElement("div");
  card.classList.add("result-card");
  card.innerHTML = `
    <h3>自己PR（たたき台）</h3>
    <pre>${prText}</pre>
  `;
  chatArea.appendChild(card);
  chatArea.scrollTop = chatArea.scrollHeight;
}

sendBtn.addEventListener("click", handleUserInput);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleUserInput();
});

// 初回の質問を表示
askNextQuestion();
