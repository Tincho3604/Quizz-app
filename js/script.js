
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
const restart_button = document.getElementById('restart-button-id');

//VARIABLES
localStorage.setItem('thematic', 'Deporte');
localStorage.setItem('correctAnswer', '0') 
localStorage.setItem('wrongAnswers', '0')
localStorage.setItem('score', '0')
localStorage.setItem('questionList', '[]')

restart_button.style.display = 'none';

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





/**
 * @desc Funcion que busca las respuestas correctas.
 */
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


/**
 * @desc  Funcion que evalua si la pregunta fue bien constestada o no, en la opccion de multiple choise
 * @param { HTML }  divElement
 * @param { String }  correctAnswer
 * @param { Int }  IdCount
 *
 */
const selectAnswer = (divElement, correctAnswer, IdCount) => {
  let scoreWins = localStorage.getItem('correctAnswer');
  let scoreLoses = localStorage.getItem('wrongAnswers');
  let score = localStorage.getItem('score');
  
  const nodes = [...divElement.parentElement.children]

  const checkAnswer = divElement.innerHTML === correctAnswer;

    for(let i=0; i<nodes.length; i++) {

      divElement.className = "correct-answer-class"
      nodes[i].classList.add("bad-answer-class");
      nodes[i].classList.remove("question-container");
    }

    if (checkAnswer) {
      localStorage.setItem('correctAnswer', parseInt(scoreWins,10) + 1);
      localStorage.setItem('score', parseInt(score,10) + 2);
    }
    else {
      localStorage.setItem('wrongAnswers', parseInt(scoreLoses,10) + 1);
      searchCorrectAnswers(nodes, correctAnswer)
    }

    setTimeout(function() { 
      Swal.fire({
        title: `${checkAnswer ? '¡Respuesta correcta!' : '¡Respuesta incorrecta!'}`,
        text: `${checkAnswer ? 'Has ganado 2 puntos' : 'Has ganado 0 puntos'}`,
        icon: `${checkAnswer ? 'success' : 'error'}`,
        confirmButtonText: `${ IdCount === '5' ? 'Ver resultados' : 'Siguiente pregunta'}`
      })
      answerQuestion();
    }
    , 1500);
}




/**
 * @desc  Funcion que resetea el cuestionario.
 */
const restartQuizz = () => location.reload()


/**
 * @desc  Funcion que cambia el Id de la pregunta
 *
 * @return { Function } 
 */
const answerQuestion = () => {
  main_form.innerHTML = ''
  localStorage.setItem('IdCount', parseInt(localStorage.getItem('IdCount'), 10) + 1)
  return renderForm(parseInt(localStorage.getItem('IdCount'), 10));  
}


/**
 * @desc  Funcion que recorta 5 preguntas de manera aleatoria para el cuestionario
 * @param { Array }  questionsList
 *
 * @return { Array }  questionsList
 *                  [
 *                     { "id": 7 , 
 *                         "quizz":"¿Quien fue el general a cargo de la Guerra de malvinas?", 
 *                         "difficulty": "H",
 *                         "options": ["Galtieri" , "Avellaneda" , "Uriburu",  "Roca"],
 *                         "correct": "GALTIERI",
 *                         "example": "Yrigoyen"
 *                       },
 *                  ]
 */
const selectRandomQuestions = questionsList => {
  let num = Math.floor(Math.random() * (10 - 1 + 1) + 1)

  for(let i=0; i<5; i++){
    questionsList.slice(num,num+5)[i].id = i+1;
  }

  return questionsList.slice(num,num+5)
}

//EVENTS
button_send_form1.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.setItem('thematic', difficulty_thematic.value)
  main_form.style.display = 'flex';
  secondary_form.style.display= 'none';
  restart_button.style.display = 'block';
  callJsonFile();
})
// Esta funcion obtiene informacion de los archivos
  const callJsonFile = () => {
    fetch(`${localStorage.getItem('thematic')}.json`)
    .then(res => res.json())
    .then(data => localStorage.setItem('questionList', JSON.stringify
    (selectRandomQuestions(data))))
    .then(() => renderForm(questionCount))
  }
  




/**
 * @desc  Funcion que ejecuta el renderizado de las preguntas.
 *
 * @param { Int }  IdCount
 *
 */
const renderForm = IdCount => {
let changeModeButton = true;
const QUESTIONS = JSON.parse(localStorage.getItem('questionList'));
  if(IdCount !== IdCount+1) changeModeButton = true;
  if(IdCount < 6) {  
    QUESTIONS.filter(item => item.id === IdCount).map(question => {
    
      localStorage.setItem('answer', question.correct);

    main_form.innerHTML += `
      <div class="main-answer-container">
        <div class="second-answer-container">
          <h3>${question.quizz}</h3>
        </div>
      </div>
      <form id="form-answer" >
        <span>Formato respuesta:</span>
        <span>${question.example}</span>
        <input type="text" id="answer-id" name="answer" />
        <input type="submit" value="Responder" class="change-input-button" />
        <button class="change-input-button" id="input-button">Cambiar a las opcciones</button>
      </form>
      
      <div class="main-question-container" id="id-main-question-container">
        <div class="question-container" onclick="selectAnswer(this, '${question.correct}', '${question.id}')">${question.options[0]}</div>   
        <div class="question-container" onclick="selectAnswer(this, '${question.correct}', '${question.id}')">${question.options[1]}</div>   
        <div class="question-container" onclick="selectAnswer(this, '${question.correct}', '${question.id}')">${question.options[2]}</div>   
        <div class="question-container" onclick="selectAnswer(this, '${question.correct}', '${question.id}')">${question.options[3]}</div>   
        
      </div>
  `
    document.getElementById('form-answer').style.display = "block"
    document.getElementById('id-main-question-container').style.display = "none"

    document.getElementById('input-button').addEventListener('click', (e) => {
      e.preventDefault();

      if(changeModeButton){
        Swal.fire({  
          showCancelButton: true,  
          confirmButtonText: `Cambiar a opcciones`,  
          denyButtonText: `Cancelar`,
          title: `¿Estas seguro que deseas cambiar a las opcciones?`,
          text: `No podras volver al modo ¡RESPUESTA DIRECTA!`,
          icon: `warning`,
        }).then((result) => {  
          
            if (result.isConfirmed) {    
              document.getElementById('form-answer').style.display = "none";
              document.getElementById('id-main-question-container').style.display = "flex";
              changeModeButton = false;
            }
        });
      }
    })
  })





// Chequea la respuesta correcta del input y suma 5 puntos y 0 si es incorrecta
document.getElementById('form-answer').onsubmit = function (e) {
  let scoreWins = localStorage.getItem('correctAnswer');
  let scoreLoses = localStorage.getItem('wrongAnswers');
  let score = localStorage.getItem('score');


  e.preventDefault();

  const checkAnswer = document.getElementById('form-answer').answer.value.toUpperCase() === localStorage.getItem('answer').toUpperCase();

   

    if (checkAnswer) {
      localStorage.setItem('correctAnswer', parseInt(scoreWins,10) + 1)
      localStorage.setItem('score', parseInt(score,10) + 5);
    } else {
      localStorage.setItem('wrongAnswers', parseInt(scoreLoses,10) + 1);
    }


    Swal.fire({
      title: `${checkAnswer ? '¡Respuesta correcta!' : '¡Respuesta incorrecta!'}`,
      text: `${checkAnswer ? `La respuesta correcta era ${localStorage.getItem('answer')}. Has ganado 5 puntos` :
      `La respuesta correcta era ${localStorage.getItem('answer')}. Has ganado 0 puntos`}`,
      icon: `${checkAnswer ? 'success' : 'error'}`,
      confirmButtonText: `${ IdCount === 5 ? 'Ver resultados' : 'Siguiente pregunta'}`
    })
    answerQuestion();
}
  } else {
      correctQuestion.innerHTML += localStorage.getItem('correctAnswer');
      wrongQuestion.innerHTML += localStorage.getItem('wrongAnswers');
      scoreContainer.innerHTML += localStorage.getItem('score');

      main_form.style.display = 'none';
      form_message.style.display = 'block';
    }
}

