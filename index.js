const API_KEY_INPUT = document.getElementById('apiKey');
const GAME_SELECT = document.getElementById('gameSelect');
const QUESTION_INPUT = document.getElementById('questionInput');
const AI_RESPONSE = document.getElementById('aiResponse');
const RESPONSE_CONTENT = document.getElementsByClassName('response-content')
const ASK_BUTTON = document.getElementById('askButton');
const FORM = document.getElementById('form');

const enviarFormulario = (event) => {
  event.preventDefault();
  
}

FORM.addEventListener('submit', enviarFormulario);