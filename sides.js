window.onload = function () {
  const sidebar = document.querySelector(".sidebar");
  const closeBtn = document.querySelector("#btn");
  const searchBtn = document.querySelector(".bx-search");
const img = document.getElementById("btn")

let toggle = true
  closeBtn.addEventListener("click", function () {
    sidebar.classList.toggle("open");
    menuBtnChange();

// toggle = !toggle;
// if(toggle){
//   img.src = "test 1/menu.pic.png"
//   } else {
//   img.src = "test 1/X.pic.png"

// }

  });

  function menuBtnChange() {
    if (sidebar.classList.contains("open")) {
      document.getElementById("m1").style.opacity = 0;
      document.getElementById("btn").style.opacity = 1;
    } else {
      document.getElementById("m1").style.opacity = 1;
    document.getElementById("btn").style.opacity = 0;
    }
  }
};
