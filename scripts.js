//Activar los popovers, es algo de Bootstrap, es mejor no hacerle mucho caso
var popoverTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="popover"]')
)
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})



let continueButton = document.getElementById("Continue-Question");
let answers = [...document.getElementsByClassName("respuesta")]

//The pseudoclass when an element is choosed is :focus
//Esto no funciona, aún
continueButton.addEventListener("click", () => {
    answers.forEach(option => {
        option.matches(':focus') ? console.log(option.id) : console.log('incorrect');
    });
})