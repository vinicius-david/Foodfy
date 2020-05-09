function addIngredient() {
  const array = document.querySelector(`#ingredients`);
  const fieldContainer = document.querySelectorAll(`.ingredient`);

  // Realiza um clone do último campo adicionado
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  // Não adiciona um novo input se o último tem um valor vazio
  if (newField.children[0].value == "") return false;

  // Deixa o valor do input vazio
  newField.children[0].value = "";
  array.appendChild(newField);

}

function addPreparation() {
    const preparations = document.querySelector("#preparations");
    const fieldContainer = document.querySelectorAll(".preparation");
    
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    if (newField.children[0].value == "") return false;

    newField.children[0].value = "";
    preparations.appendChild(newField);
}

function removeIngredient() {
  const fieldContainer = document.querySelectorAll(".ingredient");
  console.log(fieldContainer)

  if (fieldContainer.length == 1) return false
  
  const div = fieldContainer[fieldContainer.length - 1];

  div.remove()
}

function removePreparation() {
  const fieldContainer = document.querySelectorAll(".preparation");

  if (fieldContainer.length == 1) return false
  
  const div = fieldContainer[fieldContainer.length - 1];

  div.remove()
}

document.querySelector(".add-ingredient").addEventListener("click", addIngredient);
document.querySelector(".remove-ingredient").addEventListener("click", removeIngredient);

document.querySelector(".add-preparation").addEventListener("click", addPreparation);
document.querySelector(".remove-preparation").addEventListener("click", removePreparation);
