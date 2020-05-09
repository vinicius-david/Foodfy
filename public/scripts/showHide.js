const visibility = document.querySelectorAll(".visibility");
const hide = document.querySelectorAll(".show-hide");

function esconder(index) {
  visibility[index].addEventListener("click", () => {
    if (hide[index].classList.contains("hide")) {
      hide[index].classList.remove("hide");
      visibility[index].innerHTML = 'Esconder';
    } else {
      hide[index].classList.add("hide");
      visibility[index].innerHTML = 'Mostrar';
    }
  });
}

for (i = 0; i <= 2; i++) {
    esconder(i);
}