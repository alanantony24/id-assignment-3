/*
  OrDino archived demo utility script.
  This file is intentionally limited to landing-page behavior.
  Legacy API test helpers were removed to reduce confusion and risk.
*/

// Back-to-top button behavior (used by index.html)
var mybutton = document.getElementById("topBtn");

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (!mybutton) return;
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function TopFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
