setTimeout(() => {
    document.querySelector(".loader").style.display = "none";
}, 2000);

const sun = document.getElementById("moon-icon");
const moon = document.getElementById("sun-icon");
const body = document.querySelector("body");

let mood = localStorage.getItem("mood");

if(mood == "light") body.classList.remove("dark");
if(mood == "dark") body.classList.add("dark");

sun.addEventListener("click", () => {
    body.classList.remove("dark");
    localStorage.setItem("mood", "light");
});

moon.addEventListener("click", () => {
    body.classList.add("dark");
    localStorage.setItem("mood", "dark");
})
