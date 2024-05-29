
export const Header = () => {

  // ナビゲーション
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');

  hamburger.addEventListener("click", () => {
    header.classList.toggle('header--open');
  });
};

export default Header;
