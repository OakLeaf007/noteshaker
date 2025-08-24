const ham = document.querySelector(".hamburger");
const navL = document.querySelector(".nav-links");

ham.addEventListener("click", () => {
    navL.classList.toggle("active");
    ham.classList.toggle("active");
});

