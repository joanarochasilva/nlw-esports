const API_KEY_INPUT = document.getElementById('apiKey');
const GAME_SELECT = document.getElementById('gameSelect');
const QUESTION_INPUT = document.getElementById('questionInput');
const AI_RESPONSE = document.getElementById('aiResponse');
const RESPONSE_CONTENT = document.getElementsByClassName('response-content')
const ASK_BUTTON = document.getElementById('askButton');
const FORM = document.getElementById('form');


const markdownToHTML = (text) => {
  const converter = new showdown.Converter();
  return converter.makeHtml(text);
}

const perguntarIA = async (question, game, apiKey) => {
  const model = "gemini-2.5-flash";
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const pergunta = `
    ## Especialidade
    Você é um especialista assistente de meta para o jogo ${game}.

    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégia, builds e dicas.

    ## Regras
    -Se você não sabe a resposta, responda com 'Não sei!'. Não tente inventar uma resposta. 
    -Se a pergunta não está relacionada ao jogo, responda com "Essa pergunta não está relacionada ao jogo."
    -Considere a data atual ${ new Date().toLocaleDateString() }.
    -Faça pesquisas atualizadas sobre o patch atual, baseado na data atual para dar uma resposta coerente.
    -Nunca responda itens que você não tenha certeza de que existe no patch atual.

    ## Resposta
    -Economize na resposta.
    -Seja direto e responda no máximo 500 caracteres. 
    -Responda em no máximo 500 carecteres.
    -Não precisa fazer nenhuma saudação ou despedida, apenas responda a pergunta feita.

    ## Exemplo de resposta
    pergunta do usuário: Melhor build rengar jungle
    resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\nexemplo de runas\n\n
    
    ---
    Aqui esta a pergunta do usuário: ${question}
  `;

  const contents = [{
    role: "user",
    parts:[{
      text: pergunta
    }]
  }
  ];

  const tools = [{
    google_search: {},
  }
  ]
  const response = await fetch(geminiURL, { 
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({
      contents,
      tools
    })
  })

  const data = await response.json();

  return data.candidates[0].content.parts[0].text;
}

const enviarFormulario = async (event) => {
  event.preventDefault();

  let apiKey = API_KEY_INPUT.value;
  let gameSelect = GAME_SELECT.value;
  let question = QUESTION_INPUT.value;

  if(apiKey == '' || gameSelect == '' || question == '') {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  ASK_BUTTON.disabled = true;
  ASK_BUTTON.textContent = 'perguntando ...';
  ASK_BUTTON.classList.add('loading')

  try {
    const text = await perguntarIA(question, gameSelect, apiKey);

    AI_RESPONSE.querySelector('.response-content').innerHTML = markdownToHTML(text);
    AI_RESPONSE.classList.remove('hidden');
  }catch(error) {
    console.log(error)
  } finally {
    ASK_BUTTON.disabled = false;
    ASK_BUTTON.textContent = 'Perguntar';
    ASK_BUTTON.classList.remove('loading');
  }
}

FORM.addEventListener('submit', enviarFormulario);