
const initialize = () => {
  console.log('DOMContentLoaded');
};

const opening = () => {
  console.log('load');
}

window.addEventListener('DOMContentLoaded', initialize);
window.addEventListener('load', opening);
