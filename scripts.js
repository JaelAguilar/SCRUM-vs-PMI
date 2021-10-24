//Activar los popovers, es algo de Bootstrap, es mejor no hacerle mucho caso
let popoverTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="popover"]')
)
let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})
//Fin de Javascript para popover

//Definición de los elementos de HTML y bootstrap

/**
 * Botón de continuar
 */
let continueButton = document.getElementById("Continue-Question")
/**
 * Los botones de respuestas
 */
let answerButtons = [...document.getElementsByClassName("respuesta")]
/**
 * Modal de preguntas
 */
let questionsModal = new bootstrap.Modal(
    document.getElementById("questionsModal"), {
        backdrop: 'static',
        keyboard: false,
        focus: true,

  }
)
/**
 * Modal de resultados
 */
let resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"), {
    backdrop:'static',
    keyboard: false,
    focus: true,

})


/**
 * El contador de preguntas que dice "Pregunta x de X"
 */
let questionsCounterHTML = document.getElementById("questionsCounter");

//El bloque donde va a aparecer la pregunta
let questionBlock = document.getElementById("Title-Question");

//Definir las variables que se van a estar usando
/**
 * Preguntas en JSON
 */
let questions
/**
 * Contador de preguntas contestadas dentro del bloque
 */
let counter
/**
 * Veces que se ha picado al botó "ver video"
 */
let verVideoClick = 0;
/**
 * Contador de bloques contestados
 */
let blockCounter;
/**
 * Bloques de preguntas en formato JSON
 */
let block
/**
 * Botón escogido en la pregunta
 */
let buttonChoosed
/**
 * Puntaje actual
 */
let score;
/**
 * Índice de la respuesta correcta
 */
let correctAnswerIndex
/**
 * Respuestas de la pregunta específica
 */
let totalAnswers
/**
 * Dummy variable to renderize answers
 */
let isCorrectRenderized = false;
/**
 * Cantidad de preguntas de un bloque específico
 */
let totalQuestions
/**
 * Cantidad de bloques totales
 */
let totalBlocks
/**
 * Dummy variable para checar si es la primera vez que se ha picado a continuar
 */
let firstContinueClicked


/**
 * Recuerda las variables guardadas en localStorage, es conveniente poner esta función dentro de la mayoría de las funciones, si no es que todas para evitar problemas de actualización de valores
 */
function rememberVariables() {
    block = JSON.parse(localStorage.getItem('blocks'));
    buttonChoosed = localStorage.getItem("choosed");
    score = localStorage.getItem("score");

    counter = parseInt(localStorage.getItem("questionCounter"));

    blockCounter = parseInt(localStorage.getItem("blockCounter"));

    totalQuestions = Object.keys(
        block[blockCounter].questions
    ).length;
        console.debug(
          "TOTAL ANSWERS DEBUG:",
          block[blockCounter].questions[counter]
        )
    totalAnswers = Object.keys(block[blockCounter].questions[counter].incorrectAnswers).length + 1;
    console.debug(block)
    totalBlocks = Object.keys(block).length;
}


//Obtener las preguntas del documento JSON
$.getJSON("questions.json", function (questionsJSON) {
    localStorage.setItem('blocks', JSON.stringify(questionsJSON.blocks))
    block = questionsJSON.blocks;
  console.log(questionsJSON.blocks[0]) //json output
})


/**
 *Abre el Modal y especifica que el modal está abierto
 *
 */
function loadModal(modal,type) {
    modal.show();
    console.log('Modal Open: ',type)
    localStorage.setItem('isModalOpen'+type, true);
}

/**
 *Cierra el Modal y especifica que el modal está cerrado
 *
 */
function closeModal(modal,type) {
    modal.hide();
    localStorage.setItem('isModalOpen'+type, false);
    console.log("Modal Closed:",type)
}



/**
 * Abre específicamente el modal de preguntas
 */
function loadQuestionModal() {
    loadModal(questionsModal,"Questions");
    renderizeQuestion();

}

// Este código es para asegurarse que el modal se quede abierto aunque se recargue la página
let reload = sessionStorage.getItem('pageReloaded');
if (reload) {
    if (localStorage.getItem('isModalOpenQuestions')==='true') {
        loadQuestionModal();
    }
    if (localStorage.getItem('isModalOpenResults')) {
        loadModal(resultsModal, "results")
    }
    rememberVariables()
    

}
sessionStorage.setItem('pageReloaded', 'true');


/**
 *Guarda la respuesta escogida en la variable buttonChoosed
 * @param {string} number
 */
function answerChoosed(number) {

    console.log(number)
    answerButtons.forEach(button => {
        if ("respuesta" + number === button.id) {
            console.log(button.id)
            localStorage.setItem("choosed", button.textContent)
        }   
    })
    continueButton.disabled = false
}

/**
 * Función que se activa cuando se presiona el botón de continuar.
 * 
 * Si es la primera vez, primero inicializa las variables
 */
function continueButtonClicked() {
    //Esto es para ver si es la primera vez que se ha picado al botón de continuar, y si es así, se inicializan las variables
    if (localStorage.getItem("firstContinueClicked") == null) {
        initializeVariables();
        localStorage.setItem("firstContinueClicked",true)
    }
    rememberVariables();
    continueButton.disabled = true
    console.log(score);
    console.log(counter);
    console.log(totalQuestions);

    localStorage.setItem(
      "questionCounter",
      parseInt(counter) + 1
    )
    console.log("botón escogido= ",buttonChoosed)
    if (
      buttonChoosed === block[blockCounter].questions[counter].correctAnswer
    ) {
        score++
        localStorage.setItem("score", score)
        console.debug("Se escogió la correcta, calificación:", score);
    }
    console.log("bloque ", blockCounter)
    console.log("pregunta ",counter+1," de ",totalQuestions)
    if (counter >= totalQuestions - 1) {
        console.log("counter is bigger than totalQuestions")
        if (blockCounter >= totalBlocks-1) {
            renderizeResults()

        }
        else {
            closeModal(questionsModal,"Questions");
            blockCounter++
            counter=0
        }
        
        //TODO: #2 Make function to renderize results
    }
    else {
        counter++
        renderizeQuestion()
    }
    
     
    
    localStorage.setItem("questionCounter",counter)
    
    localStorage.setItem("blockCounter", blockCounter);
    
}


/**
 * Muestra la pregunta y las respuestas
 */
function renderizeQuestion() {
    rememberVariables();
    
    console.log("counter=", counter)

    
    console.log("blockcounter=", blockCounter)
    console.log(block[blockCounter].questions[counter])
    questionBlock.textContent = block[blockCounter].questions[counter].question
    console.log(questionsCounterHTML)
    questionsCounterHTML.textContent="".concat("Pregunta ",counter+1," de ",totalQuestions)
    console.log("pregunta ", counter + 1, " de ", totalQuestions)
    

    console.log(
      "pregunta=",
      block[blockCounter].questions[counter].question
    )
    console.log("HTML pregunta=", questionBlock)
    renderizeAnswers();
}

/**
 * Pone el texto de las respuestas en cada botón, y escoge uno random para poner la respuesta correcta
 */
function renderizeAnswers() {
    /*totalAnswers = block[blockCounter].questions[counter]*/
    correctAnswerIndex = parseInt(Math.ceil(Math.random()*totalAnswers));
    isCorrectRenderized = false;
    answerButtons.forEach((button) => {
        if (parseInt(button.id.slice(-1)) === correctAnswerIndex) {
          button.textContent =
            block[blockCounter].questions[counter].correctAnswer
          isCorrectRenderized = true
        }
        else {
           /* console.log(
          "Answer Comparison: ",
          button.id.slice(-1),
          correctAnswerIndex
        )*/
        button.textContent =
          block[blockCounter].questions[counter].incorrectAnswers[
            parseInt(button.id.slice(-1)) - 1 + (isCorrectRenderized ? (-1)  : 0)
          ]

        /*console.debug(
          "Incorrect Answers Debug:",
          isCorrectRenderized ? 1 : 0,
          parseInt(button.id.slice(-1))
        )

        //console.debug(
          "Incorrect Answer index: ",
          parseInt(button.id.slice(-1)) + (isCorrectRenderized ? (-1) : 0) - 1
        )
        console.debug(
          block[blockCounter].questions[counter].incorrectAnswers[
            parseInt(button.id.slice(-1)) + (isCorrectRenderized ? (-1) : 0) - 1
          ]
        )*/}
        
        
        

      /*console.log(button.id, button.id[-1])
      button.textContent = questions[counter].answers[button.id.slice(-1) - 1]*/
      //TODO: #3 Change the question appearing by blocks
    })
    isCorrectRenderized = false
}

/**
 * Esto es para asegurarse de que el usuario vea la advertencia antes de ver el video
 */
function verVideo() {
    verVideoClick++;
    if (verVideoClick % 2 === 0) {
        closeModal(questionsModal,"Questions")
    }
}

function renderizeResults() {
    closeModal(questionsModal,"Questions")
    loadModal(resultsModal,"Results")

}

/**
 * Inicializa las variables
 */
function initializeVariables() {
    localStorage.setItem('score', 0)
    localStorage.setItem("questionCounter",0)
    localStorage.setItem("blockCounter",0)
}