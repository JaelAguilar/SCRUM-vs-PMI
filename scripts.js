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

/** 
 * Botón de ver video de nuevo
 * @type {HTMLElement} */
let videoDeNuevoButton = document.getElementById("video-de-nuevo")

/**
 * Div donde aparecen las preguntas y respuestas correctas e incorrectas
 *  @type {HTMLElement} */
let finalAnswersBlock = document.getElementById(
  "preguntas-respuestas-correctas"
)
//Definir las variables que se van a estar usando
/**
 * Preguntas en JSON
 */
let questions
/**
 * Contador de preguntas contestadas dentro del bloque
 */
let counter=0
/**
 * Veces que se ha picado al botó "ver video"
 */
let verVideoClick = 0;
/**
 * Contador de bloques contestados
 */
let blockCounter=0;
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
let score = 0;
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
 * JSON de los links a los videos 
 * @type {JSONObject} */
let videos
/**
 * Contador de videos mostrados
 *  @type {int} */
let videoCounter = 0;

/** 
 * Lista donde pondré los números de las respuestas correctas
 * @type {Array} */
let answersArray = [];



//Obtener las preguntas y los links a youtube del documento JSON
$.getJSON("data.json", function (data) {
    block = data.blocks;
    videos = data.videos;
    //console.log(data.blocks[0])
    showNextVideo() 
})





/**
 * Abre el modal de preguntas cuando se pica al botón de Preguntas, o el de respuestas cuando ya se acabaron los bloques
 */
function startQuestions() {
    //console.log("blockCounter 1: ",blockCounter)
    if (verVideoClick >= 2) {
        verVideoClick = 0
        videoDeNuevoButton.disabled=true
    }
    else {
        videoCounter++
        videoDeNuevoButton.disabled=false
    }
    if (blockCounter >= block.length) {
        //console.debug("Results should be showed")
      renderizeResults()
    }
    else {
        //console.log("Video Counter: ", videoCounter)
        questionsModal.show()
        renderizeQuestion()
    }
    //console.log("blockCounter 2: ", blockCounter)
    
}




/**
 *Guarda la respuesta escogida en la variable buttonChoosed
 * @param {string} number
 */
function answerChoosed(number) {

    //console.log(number)
    answerButtons.forEach(button => {
        if ("respuesta" + number === button.id) {
            //console.log(button.id)
            buttonChoosed=button.textContent
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
    

    continueButton.disabled = true
    if (
      buttonChoosed === block[blockCounter].questions[counter].correctAnswer
    ) {
        score++
  }
  

  answersArray.push(buttonChoosed);
  console.log(answersArray);
renderizeEachQuestion()
    if (counter >= totalQuestions - 1) {
        //console.log("counter is bigger than totalQuestions")
        renderizeUrls()
        if (blockCounter >= block.length - 1) {
          renderizeResults()
        } else {
          
          questionsModal.hide()
          blockCounter++
            counter = 0
          showNextVideo()
          
        }
        
    }
    else {
        
        counter++
        renderizeQuestion()
    }
}


/**
 * Muestra la pregunta y las respuestas
 */
function renderizeQuestion() {

    totalQuestions = Object.keys(block[blockCounter].questions).length
    //console.log("totalQuestions ",totalQuestions)
    //console.log("counter=", counter)

    
    //console.log("blockcounter=", blockCounter)

    questionBlock.textContent = block[blockCounter].questions[counter].question

    questionsCounterHTML.textContent="".concat("Capítulo ",blockCounter+1,". Pregunta ",counter+1," de ",totalQuestions)
    //console.log("pregunta ", counter + 1, " de ", totalQuestions)
    

    /*console.log(
      "pregunta=",
      block[blockCounter].questions[counter].question
    )*/

    renderizeAnswers();
}

/**
 * Pone el texto de las respuestas en cada botón, y escoge uno random para poner la respuesta correcta
 */
function renderizeAnswers() {

    totalAnswers = Object.keys(block[blockCounter].questions[counter].incorrectAnswers).length+1
    
    correctAnswerIndex = parseInt(Math.ceil(Math.random()*totalAnswers));
    isCorrectRenderized = false;
    answerButtons.forEach((button) => {
      if (parseInt(button.id.slice(-1)) === correctAnswerIndex) {
        button.textContent =
          block[blockCounter].questions[counter].correctAnswer
        isCorrectRenderized = true
      }
      else {
        button.textContent =
          block[blockCounter].questions[counter].incorrectAnswers[
          parseInt(button.id.slice(-1)) - 1 + (isCorrectRenderized ? (-1) : 0)
          ]
      }

    })
    isCorrectRenderized = false
}

/**
 * Esto es para asegurarse de que el usuario vea la advertencia antes de ver el video
 */
function verVideo() {
    
    verVideoClick++;
    if (verVideoClick >=2) {
        questionsModal.hide()
        
    }
}


/**
 *Shows the results modal with the results
 *
 */
function renderizeResults() {
    blockCounter=block.length //This fixes a bug in startQuestions
    questionsModal.hide()
    resultsModal.show()
  resultsTitle.textContent = "¡Tuviste " + score + " respuestas correctas!"
}

/**
 *Cierra el modal de resultados al presionar el botón "Terminar"
 *
 */
function finishButtonClicked() {
    resultsModal.hide()
    questionsModal.hide()
}

function showNextVideo() {
    //console.debug("videoCounter: ",videoCounter)
    //console.debug("Video showed link is ",videos[videoCounter].url)
    videoContainer.src =`${videos[videoCounter].url}` //This is a weird bug, and i don't know why it works. If this fails, add a ./media/ and it will be done :p
}

/**
 *Reinicia todo
 
 (Honestamente sólo le da un reload y ps todo vuelve a su estado original)
 *
 */
function reset() {
  location.reload(true)
}

/**
 *Renderiza cada pregunta junto con su respuesta correcta y la incorrecta en el panel de respuestas.
 *
 */
function renderizeEachQuestion() {
  let pregunta = document.createElement('p');
  pregunta.innerText = block[blockCounter].questions[counter].question
  pregunta.style.fontWeight = "bold";
  pregunta.classList.add("resultsQuestions")
  finalAnswersBlock.appendChild(pregunta)
  
  let respuesta = document.createElement('p');
  respuesta.innerText = buttonChoosed
  respuesta.classList.add("resultsText")
  let respuestaCorrecta

  if (buttonChoosed === block[blockCounter].questions[counter].correctAnswer) {
    respuesta.style.color = "green";
  } else {
    respuesta.style.color = "red"
     respuestaCorrecta= document.createElement('p');
    respuestaCorrecta.innerText =
      block[blockCounter].questions[counter].correctAnswer;
    respuestaCorrecta.style.color = "green"
    respuestaCorrecta.classList.add("resultsText")
  }
  finalAnswersBlock.appendChild(respuesta);
  if (respuestaCorrecta) {
    finalAnswersBlock.appendChild(respuestaCorrecta)
  }
}

/**
 *Renderiza los links de cada capítulo en el modal de resultados
 *
 */
function renderizeUrls() {
  let url = document.createElement("a")
  url.href = block[blockCounter].questions[counter].url
  url.target = "_blank"
  url.innerText = "Más información"
  finalAnswersBlock.appendChild(url)
}