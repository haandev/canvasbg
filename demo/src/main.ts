import "./style.css";
import "./bg.ts";

const navlinks = document.querySelectorAll(".navlink");
const body = document.querySelector("body");
navlinks.forEach((link) => {
  link.addEventListener("click", () => {
    navlinks.forEach((link) => link.classList.remove("active"));
    link.classList.add("active");
    body?.classList.add("content-open");
  });
});
