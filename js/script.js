const QUESTIONS = [
  { id: 1 , 
    quizz:"¿Quien es el presidente actual de la Republica Argentina?", 
    difficulty: "E",
    options: [ "Cristina Fernández de Kirchner", "Alberto fernandez", "Carlos Menem", "Hipólito Yrigoyen"],
    correct: "Alberto fernandez"
  }, 
  { id: 2 , 
    quizz:"¿Cuantos años dura el gobierno de un presidente argentino", 
    difficulty: "E",
    options: [2,4,5,3],
    correct: 4,
  }, 
  { id: 3 , 
    quizz:"¿Entre que años goberno peron?", 
    difficulty: "H",
    options: ["1946-1952", "1955-1968", "1932-1984", "1946-1955"],
    correct: "1946-1952"
  }, 
  { id: 4 , 
    quizz:"¿Cual es el partido del economista javier milei?", 
    difficulty: "M",
    options: ["Frente de todos", "Avanza libertad", "Juntos por el cambio", "Frente Patriota"],
    correct: "Avanza libertad"
  }, 
  { id: 5 , 
    quizz:"¿Cuantas reelecciones tuvo la Ex presidenta Cristina Fernández de Kirchner?", 
    difficulty: "H",
    options: [2 , 3 , 5,  1],
    correct: 2
  }, 
]


// CONSTANTS
const difficulty_thematic = document.getElementsByClassName("difficulty-thematic-main-container");
const button_send_form1 = document.getElementById('id-submit-button-form1');
const main_form = document.getElementById('id-main-form-header');
const secondary_form = document.getElementById('id-difficulty-thematic-main-container');
const main_question_container = document.getElementById('id-main-question-container');
const form_message = document.getElementById('success-form-message');


let questionCount = 1;
localStorage.setItem('IdCount', questionCount);
form_message.style.display = 'none'


//FUNCTIONS

const searchCorrectAnswers = (arrNodes, selectValue) => {
  let index;
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



const selectAnswer = (divElement, correctAnswer) => {
  const nodes = [...divElement.parentElement.children]

  if(divElement.innerHTML === correctAnswer) {

    for(let i=0; i<nodes.length; i++) {

      divElement.className = "correct-answer-class"
      nodes[i].classList.add("bad-answer-class");
      nodes[i].classList.remove("question-container");
    }
    setTimeout(function() { 
      answerQuestion();
    }
    , 1000);

  } else {

      searchCorrectAnswers(nodes, correctAnswer)
      setTimeout(function() { 
        answerQuestion();
      }
      , 1000);
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


const renderForm = IdCount => {
   if(IdCount < 6) { 
   QUESTIONS.filter(item => item.id === IdCount).map((question, index) => {
    main_form.innerHTML += `
      <div class="main-answer-container">
        <div class="second-answer-container">
          <h3>${question.quizz}</h3>
        </div>
      </div>
      <div class="main-question-container" id="id-main-question-container">
        <div class="question-container" onclick="selectAnswer(this, '${question.correct}')">${question.options[0]}</div>   
        <div class="question-container" onclick="selectAnswer(this, '${question.correct}')">${question.options[1]}</div>   
        <div class="question-container" onclick="selectAnswer(this, '${question.correct}')">${question.options[2]}</div>   
        <div class="question-container" onclick="selectAnswer(this, '${question.correct}')">${question.options[3]}</div>   
      </div>
  `
    })
  } else {
    main_form.style.display = 'none';
    form_message.style.display = 'block'
  }
}

 if (showQuestions) {
  renderForm(questionCount);
 
}

