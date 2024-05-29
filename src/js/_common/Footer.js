
export const Footer = () => {

  // top に戻るボタン
  const top_button = document.getElementById('top_button');
  top_button.addEventListener("click", () => {
    gsap.set( window, {scrollTo: { y: 200}});
    gsap.to( window, {duration: 0.85,ease: 'power4.out',scrollTo: { y: 0}});
  });
};

export default Footer;
