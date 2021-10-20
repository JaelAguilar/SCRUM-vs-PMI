//Activar los popovers, es algo de Bootstrap, es mejor no hacerle mucho caso
let popoverTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="popover"]')
)
let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})
//Fin de Javascript para popover

//Definición de los elementos de HTML y bootstrap
//Botón de continuar
let continueButton = document.getElementById("Continue-Question")
//Los botones de respuestas
let answerButtons = [...document.getElementsByClassName("respuesta")]
//Modal de preguntas
let questionsModal = new bootstrap.Modal(
    document.getElementById("questionsModal"), {
        backdrop: 'static',
        keyboard: false,
        focus: true,
  }
)

//El contador de preguntas que dice "Pregunta x de X"
let questionsCounter = document.getElementsByClassName("questionsCounter");

//El bloque donde va a aparecer la pregunta
let questionBlock = document.getElementById("Title-Question");

//Definir las variables que se van a estar usando
let questions
let counter
let verVideoClick = 0;
let answer


//Obtener las preguntas del documento JSON
$.getJSON("questions.json", function (questionsJSON) {
    event.preventDefault()
    localStorage.setItem('questions', JSON.stringify(questionsJSON.questions))
    questions = questionsJSON.questions;
  console.log(questionsJSON.questions[0]) //json output
})


/**
 *Abre el Modal y especifica que el modal está abierto
 *
 */
function loadModal(modal) {
    modal.show();
    console.log('Modal Open')
    localStorage.setItem('isModalOpen', true);
}

/**
 *Cierra el Modal y especifica que el modal está cerrado
 *
 */
function closeModal(modal) {
    modal.hide();
    localStorage.setItem('isModalOpen', false);
    console.log("Modal Closed")
}



/**
 * Abre específicamente el modal de preguntas
 */
function loadQuestionModal() {
    loadModal(questionsModal);
    renderizeQuestion();

}

// Este código es para asegurarse que el modal se quede abierto aunque se recargue la página
let reload = sessionStorage.getItem('pageReloaded');
if (reload) {
    if (localStorage.getItem('isModalOpen')==='true') {
        loadQuestionModal();
    }
}
sessionStorage.setItem('pageReloaded', 'true');


/**
 *Agrega una clase llamada 'choosed' a la respuesta elegida, y se asegura que ninguna otra la tenga.
 *No sé si haya una mejor solución, estoy abierto a ideas
 * @param {string} number
 */
function answerChoosed(number) {
    console.log(number)
    answerButtons.forEach(option => {
        if (option.id === 'respuesta' + number) {
            localStorage.setItem('choosed', option.id)
        }
    })
}

localStorage.setItem('score', 0);

function answerQuestion() {
    score = localStorage.getItem('score');
    answer = localStorage.getItem('choosed');
    localStorage.setItem(
      "questionCounter",
      parseInt(localStorage.getItem("questionCounter")) + 1
    )
    if (answer=='Correct Answer') {
        score++;
    }
    
    localStorage.setItem('score', score);
    renderizeQuestion();
}

localStorage.setItem('questionCounter', 0);

function renderizeQuestion() {
    counter = localStorage.getItem('questionCounter')
    console.log("counter=", counter)
    questions=JSON.parse(localStorage.getItem('questions'))
    questionBlock.textContent = questions[counter].question
    console.log("pregunta=",questions[counter].question)
    console.log("HTML pregunta=", questionBlock)
    answerButtons.forEach(button => {
        console.log(button.id, button.id[-1])
        button.textContent = questions[counter].answers[button.id.slice(-1)-1]
    });
}



function verVideo() {
    verVideoClick++;
    if (verVideoClick % 2 === 0) {
        closeModal(questionsModal)
    }
}