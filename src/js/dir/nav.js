
const initialize = () => {
  console.log('DOMContentLoaded');
};

const opening = () => {
  // console.log('load');

  setTimeout (() => {
    const content = document.getElementById("content");
    content.classList.add("animation");
  },1000)
}

window.addEventListener('DOMContentLoaded', initialize);
window.addEventListener('load', opening);
