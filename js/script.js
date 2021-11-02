
// CONSTANTS
const difficulty_thematic = document.getElementsByClassName("difficulty-thematic-main-container");
const button_send_form1 = document.getElementById('id-submit-button-form1');
const main_form = document.getElementById('id-main-form-header');
const secondary_form = document.getElementById('id-difficulty-thematic-main-container');
const main_question_container = document.getElementById('id-main-question-container');
const form_message = document.getElementById('success-form-message');
const openModal = document.querySelector('.hero__cta');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.modal__close');


// RENDER MODAL
openModal.addEventListener('click', (e)=>{
    e.preventDefault();
    modal.classList.add('modal--show');
});

closeModal.addEventListener('click', (e)=>{
    e.preventDefault();
    modal.classList.remove('modal--show');
});
let questionCount = 1;
localStorage.setItem('IdCount', questionCount);
form_message.style.display = 'none'


//FUNCTIONS

const searchCorrectAnswers = (arrNodes, selectValue) => {
  let divValue;

  for (let i = 0; i < arrNodes.length; i++) {
       if(arrNodes[i].innerHTML === selectValue){
        index = arrNodes.indexOf(arrNodes[i]);
        divValue = arrNodes[i]
      }
    }
    arrNodes.filter(item => item !== divValue).map(items => {
      divValue.className = "correct-answer-class"
      items.classList.add("bad-answer-class");
      items.classList.remove("question-container");
    })

}


const changeModeInput = () => {
  document.getElementById('form-answer').style.display = "block"
  document.getElementById('id-main-question-container').style.display = "none"
} 


const selectAnswer = (divElement, correctAnswer, IdCount) => {

  const nodes = [...divElement.parentElement.children]
  document.getElementById('change-options-button').style.display = "none"
  if(divElement.innerHTML === correctAnswer) {

    for(let i=0; i<nodes.length; i++) {

      divElement.className = "correct-answer-class"
      nodes[i].classList.add("bad-answer-class");
      nodes[i].classList.remove("question-container");
    }
    setTimeout(function() { 
      Swal.fire({
        title: '¡Respuesta correcta!',
        text: `Has ganado 2 puntos`,
        icon: 'success',
        confirmButtonText: `${ IdCount === '5' ? 'Ver resultados' : 'Siguiente pregunta'}`
      })
      answerQuestion();
    }
    , 1500);

  } else {

      searchCorrectAnswers(nodes, correctAnswer)
      setTimeout(function() { 
        Swal.fire({
          title: '¡Respuesta incorrecta!',
          text: `Has ganado 0 puntos`,
          icon: 'error',
          confirmButtonText: `${ IdCount === '5' ? 'Ver resultados' : 'Siguiente pregunta'}`
        })
        answerQuestion();
      }
      , 1500);
  }
  
}

const restartQuizz = () => location.reload()


const answerQuestion = () => {
  main_form.innerHTML = ''
  localStorage.setItem('IdCount', parseInt(localStorage.getItem('IdCount'), 10) + 1)
  return renderForm(parseInt(localStorage.getItem('IdCount'), 10));  
}


//VARIABLES
let showQuestions = true;

//EVENTS
button_send_form1.addEventListener('click', (e) => {
    e.preventDefault();
    main_form.style.display = 'flex';
    secondary_form.style.display= 'none';
    showQuestions = false;
  })



const renderForm = (IdCount) => {
  
  fetch('questions.json')
  .then(res => res.json())
  .then(data => QUESTIONS = data)
  .then(() => {

  if(IdCount < 6) { 
 
    QUESTIONS.filter(item => item.id === IdCount).map((question, index) => {
    localStorage.setItem('answer', question.correct);
    main_form.innerHTML += `
      <div class="main-answer-container">
        <div class="second-answer-container">
          <h3>${question.quizz}</h3>
        </div>
      </div>
      <form id="form-answer" >
        <span>Formato respuesta: ${question.example}</span>
        <input type="text" id="answer-id" name="answer" />
        <input type="submit" value="Responder" class="change-input-button" />
        <button class="change-input-button" id="input-button">Cambiar a las opcciones</button>
      </form>
      
      <div class="main-question-container" id="id-main-question-container">
        <div class="question-container" onclick="selectAnswer(this, '${question.correct}', '${question.id}')">${question.options[0]}</div>   
        <div class="question-container" onclick="selectAnswer(this, '${question.correct}', '${question.id}')">${question.options[1]}</div>   
        <div class="question-container" onclick="selectAnswer(this, '${question.correct}', '${question.id}')">${question.options[2]}</div>   
        <div class="question-container" onclick="selectAnswer(this, '${question.correct}', '${question.id}')">${question.options[3]}</div>   
        
        <button id="change-options-button" onclick="changeModeInput()">Cambiar modo</button>
      </div>
  `
    document.getElementById('form-answer').style.display = "none"

    document.getElementById('input-button').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('form-answer').style.display = "none"
      document.getElementById('id-main-question-container').style.display = "flex"
    })
    })





// Chequea la respuesta correcta del input y suma 5 puntos y 0 si es incorrecta
document.getElementById('form-answer').onsubmit = function (e) {
  e.preventDefault();
  if (document.getElementById('form-answer').answer.value === localStorage.getItem('answer').toUpperCase()) {
    
    Swal.fire({
      title: '¡Respuesta correcta!',
      text: `La respuesta correcta era ${localStorage.getItem('answer')}. Has ganado 5 puntos`,
      icon: 'success',
      confirmButtonText: `${ IdCount === 5 ? 'Ver resultados' : 'Siguiente pregunta'}`
    })
    answerQuestion();
  } else {
    Swal.fire({
      title: '¡Respuesta incorrecta!',
      text: `La respuesta correcta era ${localStorage.getItem('answer')}. Has ganado 0 puntos`,
      icon: 'error',
      confirmButtonText: `${ IdCount === 5 ? 'Ver resultados' : 'Siguiente pregunta'}`
    })
    answerQuestion();
  }
  document.getElementById('form-answer').reset();
}
  } else {
    main_form.style.display = 'none';
    form_message.style.display = 'block'
  }
})
}



if (showQuestions) {
  renderForm(questionCount);
}






