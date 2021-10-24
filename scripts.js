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

/** 
 * Donde aparece la pregunta
 * @type {HTMLElement} */
let questionBlock = document.getElementById("Title-Question");

/** 
 * Donde aparecen cuántas respuestas fueron correctas
 * @type {HTMLElement} */
let resultsTitle = document.getElementById("Title-Results")

/**
 * Donde aparece el video
 *  @type {HTMLElement} */
let videoContainer = document.getElementById("videoFrame")

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
 * JSON de los links a los videos 
 * @type {JSONObject} */
let videos
/**
 * Contador de videos mostrados
 *  @type {int} */
let videoCounter
/**
 * Videos en total que se van a ver
 */
let totalVideos

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
    firstContinueClicked = localStorage.getItem("firstContinueClicked")
    videoCounter = localStorage.getItem("videoCounter")
    videos= JSON.parse(localStorage.getItem('videos'))
}


//Obtener las preguntas y los links a youtube del documento JSON
$.getJSON("data.json", function (data) {
    localStorage.setItem('blocks', JSON.stringify(data.blocks))
    block = data.blocks;
    localStorage.setItem('videos', JSON.stringify(data.videos))
    videos = data.videos;
  console.log(videos[0].url) //json output
})


/**
 *
 *
 */
/**
 *
 *Abre el Modal y especifica que el modal está abierto
 * @param {Modal} modal
 * @param {String} type
 */
function loadModal(modal,type) {
    modal.show();
    console.log('Modal Open: ',type)
    localStorage.setItem('isModalOpen'+type, true);
}

/**
 *
 *Cierra el Modal y especifica que el modal está cerrado
 *
 
 *
 * @param {bootstrap.Modal} modal
 * @param {string} type
 */
function closeModal(modal,type) {
    modal.hide();
    localStorage.setItem('isModalOpen'+type, false);
    console.log("Modal Closed:",type)
}



/**
 * Abre específicamente el modal de preguntas
 */
function startQuestions() {
  //Esto es para ver si es la primera vez que se ha picado al botón de continuar, y si es así, se inicializan las variables
  console.log("firstContinueClicked: ", firstContinueClicked)
  if (firstContinueClicked == null) {
    initializeVariables()
    localStorage.setItem("firstContinueClicked", true)
    }
    localStorage.setItem('videoCounter',videoCounter++)

  console.log("firstContinueClicked: ", firstContinueClicked)
  loadModal(questionsModal, "Questions")
  renderizeQuestion()
}

// Este código es para asegurarse que el modal se quede abierto aunque se recargue la página
let reload = sessionStorage.getItem('pageReloaded');
if (reload) {
    console.log("Open Modal Questions", localStorage.getItem("isModalOpenQuestions"))
    console.log(
      "Open Modal Results",
      localStorage.getItem("isModalOpenResults")
    )
    if (localStorage.getItem("isModalOpenResults") === "true") {
      renderizeResults()
    }
    else if (localStorage.getItem('isModalOpenQuestions')==='true') {
        startQuestions()
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
            counter = 0
            showNextVideo();
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
    
    //console.log("counter=", counter)

    
   // console.log("blockcounter=", blockCounter)

    //console.log(block[blockCounter].questions[counter])
    questionBlock.textContent = block[blockCounter].questions[counter].question
    //console.log(questionsCounterHTML)
    questionsCounterHTML.textContent="".concat("Pregunta ",counter+1," de ",totalQuestions)
    console.log("pregunta ", counter + 1, " de ", totalQuestions)
    

    /*console.log(
      "pregunta=",
      block[blockCounter].questions[counter].question
    )
    console.log("HTML pregunta=", questionBlock)*/
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


/**
 *Shows the results modal with the results
 *
 */
function renderizeResults() {
    //();
    closeModal(questionsModal,"Questions")
    loadModal(resultsModal, "Results")
    resultsTitle.textContent="¡Tuviste "+score+" respuestas correctas!"

}

/**
 * Inicializa las variables
 */
function initializeVariables() {
    localStorage.setItem('score', 0)
    localStorage.setItem("questionCounter",0)
    localStorage.setItem("blockCounter", 0)
    localStorage.setItem("videoCounter",0)
}

/**
 *Cierra el modal de resultados al presionar el botón "Terminar"
 *
 */
function finishButtonClicked() {
    closeModal(resultsModal, "Results")
}

function showNextVideo() {
    videoCounter++
    console.debug("Video counter: ",videoCounter)
    console.debug("Next video url",videos)
    videoContainer.src = videos[videoCounter].url;
    localStorage.setItem('videoCounter', videoCounter)
    console.debug("Next video is showed")
}