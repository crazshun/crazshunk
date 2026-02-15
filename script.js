const chatArea = document.querySelector(".chat-area");
const input = document.querySelector("#chat-input");
const sendBtn = document.querySelector("#send-btn");

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

function askNextQuestion() {
  if (currentStep < questions.length) {
    addMessage(questions[currentStep], "bot");
  } else {
    generatePR();
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
    case 0: answers.episode = text; break;
    case 1: answers.situation = text; break;
    case 2: answers.role = text; break;
    case 3: answers.action = text; break;
    case 4: answers.result = text; break;
    case 5: answers.learning = text; break;
  }
}

// -------------------------
// AI接続部分
// -------------------------

async function generatePR() {
  addMessage("ちょっと待ってね…自己PRを作成中だよ！", "bot");

  const apiKey = "skzahun";

  const prompt = `
あなたは就活のプロのキャリアアドバイザーです。
以下のユーザーの回答をもとに、STAR法で400字の自己PRを作成してください。

【エピソード】${answers.episode}
【状況】${answers.situation}
【役割】${answers.role}
【行動】${answers.action}
【結果】${answers.result}
【学び・強み】${answers.learning}

文章は読みやすく、論理的に、就活向けに整えてください。
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500
      })
    });

    const data = await response.json();
    const prText = data.choices[0].message.content;

    const card = document.createElement("div");
    card.classList.add("result-card");
    card.innerHTML = `
      <h3>AIが作成した自己PR</h3>
      <pre>${prText}</pre>
    `;
    chatArea.appendChild(card);
    chatArea.scrollTop = chatArea.scrollHeight;

  } catch (error) {
    addMessage("エラーが発生したよ…APIキーが正しいか確認してみて！", "bot");
    console.error(error);
  }
}

// イベント設定
sendBtn.addEventListener("click", handleUserInput);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleUserInput();
});

// 初回の質問
askNextQuestion();
