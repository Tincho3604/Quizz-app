
// CONSTANTS
const difficulty_thematic = document.getElementById('thematic');
const button_send_form1 = document.getElementById('id-submit-button-form1');
const main_form = document.getElementById('id-main-form-header');
const secondary_form = document.getElementById('id-difficulty-thematic-main-container');
const main_question_container = document.getElementById('id-main-question-container');
const form_message = document.getElementById('success-form-message');
const openModal = document.querySelector('.hero__cta');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.modal__close');
const correctQuestion = document.getElementById('correct-question');
const wrongQuestion = document.getElementById('wrong-question');
const scoreContainer = document.getElementById('score-span');

//VARIABLES
localStorage.setItem('thematic', 'Deporte');
localStorage.setItem('correctAnswer', '0') 
localStorage.setItem('wrongAnswers', '0')
localStorage.setItem('score', '0')


// RENDER MODAL
openModal.addEventListener('click', (e) => {
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



// Cambia de modo "Multiple Choise" a "Respuesta directa"
const changeModeInput = () => {
  document.getElementById('form-answer').style.display = "block"
  document.getElementById('id-main-question-container').style.display = "none"
} 



// Evalua si la pregunta fue bien constestada o no, en la opccion de multiple choise
const selectAnswer = (divElement, correctAnswer, IdCount) => {
  let scoreWins = localStorage.getItem('correctAnswer');
  let scoreLoses = localStorage.getItem('wrongAnswers');
  let score = localStorage.getItem('score');
  
  const nodes = [...divElement.parentElement.children]
  
  document.getElementById('change-options-button').style.display = "none"

  if(divElement.innerHTML === correctAnswer) {

    for(let i=0; i<nodes.length; i++) {

      divElement.className = "correct-answer-class"
      nodes[i].classList.add("bad-answer-class");
      nodes[i].classList.remove("question-container");
    }

    localStorage.setItem('correctAnswer', parseInt(scoreWins,10) + 1);
    localStorage.setItem('score', parseInt(score,10) + 2);

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
      localStorage.setItem('wrongAnswers', parseInt(scoreLoses,10) + 1);
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





// Resetea el cuestionario
const restartQuizz = () => location.reload()


// Esta funcion cambia el Id de la pregunta
const answerQuestion = () => {
  main_form.innerHTML = ''
  localStorage.setItem('IdCount', parseInt(localStorage.getItem('IdCount'), 10) + 1)
  return renderForm(parseInt(localStorage.getItem('IdCount'), 10));  
}


// Selecciona del JSON 5 preguntas y les asigna el ID del 1 al 5
const selectRandomQuestions = (ar) => {
  let num = Math.floor(Math.random() * (45 - 1 + 1) + 1)
  let cont = 1
  for(let i=0; i<5; i++){
    ar.slice(num,num+5)[i].id = cont++;
  }
  return ar.slice(num,num+5)
}


//EVENTS
button_send_form1.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.setItem('thematic', difficulty_thematic.value)
    main_form.style.display = 'flex';
    secondary_form.style.display= 'none';
    renderForm(questionCount);
  })






// Funcion que ejecuta el renderizado de las preguntas.
const renderForm = (IdCount) => {
  fetch(`${localStorage.getItem('thematic')}.json`)
  .then(res => res.json())
  .then(data => QUESTIONS = data)
  .then(() => {

  if(IdCount < 6) { 
    selectRandomQuestions(QUESTIONS).filter(item => item.id === IdCount).map(question => {
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
  let scoreWins = localStorage.getItem('correctAnswer');
  let scoreLoses = localStorage.getItem('wrongAnswers');
  let score = localStorage.getItem('score');


  e.preventDefault();
  if (document.getElementById('form-answer').answer.value === localStorage.getItem('answer').toUpperCase()) {
    
    localStorage.setItem('score', parseInt(score,10) + 5);
    localStorage.setItem('correctAnswer', parseInt(scoreWins,10) + 1);
    Swal.fire({
      title: '¡Respuesta correcta!',
      text: `La respuesta correcta era ${localStorage.getItem('answer')}. Has ganado 5 puntos`,
      icon: 'success',
      confirmButtonText: `${ IdCount === 5 ? 'Ver resultados' : 'Siguiente pregunta'}`
    })

    answerQuestion();

  } else {

    localStorage.setItem('wrongAnswers', parseInt(scoreLoses,10) + 1);
    
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
      correctQuestion.innerHTML += localStorage.getItem('correctAnswer');
      wrongQuestion.innerHTML += localStorage.getItem('wrongAnswers');
      scoreContainer.innerHTML += localStorage.getItem('score');

      main_form.style.display = 'none';
      form_message.style.display = 'block';
    }
  })
}




