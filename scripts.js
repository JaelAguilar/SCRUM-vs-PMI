//Activar los popovers, es algo de Bootstrap, es mejor no hacerle mucho caso
var popoverTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="popover"]')
)
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})
//Fin de Javascript para popover

//Definición de los elementos
//Botón de continuar
var continueButton = document.getElementById("Continue-Question")
//Los botones de respuestas
var answers = [...document.getElementsByClassName("respuesta")]
//Modal de preguntas
var questionsModal = new bootstrap.Modal(document.getElementById("questionsModal"))


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
 * Cierra específicamente el modal de preguntas
 */
function closeQuestionModal() {
    closeModal(questionsModal);
}

// Este código es para asegurarse que el modal se quede abierto aunque se recargue la página
let reload = sessionStorage.getItem('pageReloaded');
if (reload) {
    if (localStorage.getItem('isModalOpen')==='true') {
        loadModal(questionModal);
    }
}
sessionStorage.setItem('pageReloaded', 'true');




//The pseudoclass when an element is choosed is :focus
//Esto no funciona, aún
continueButton.addEventListener("click", () => {
    answers.forEach(option => {
        option.matches(':focus') ? console.log(option.id) : console.log('incorrect');
    });
})