
export default class CommonUi {
  constructor(){
    this.body = document.getElementsByTagName('body')[0];

    this.nav = document.getElementById('nav');
    this.navBg = document.getElementById('nav_bg');
    this.navFlag = false;
    this.animationTime = .5;
  }

  init(){
    this.headerFunc();
    this.topButton();
  }

  headerFunc(){
    const navBtn = document.querySelectorAll('.navBtn');
    navBtn.forEach((e) => {
      e.addEventListener('click', () => {
        if(!this.navFlag) this.headerOpen();
        else this.headerClose();
      })
    })
  }
  headerOpen(){
    this.navFlag = true;
    this.body.style.overflow = 'hidden';

    // nav
    gsap.set(this.nav, { display: 'block', opacity: 0, x: '20%'});
    gsap.to(this.nav, { duration: this.animationTime, ease: "power3.out", opacity: 1, x: 0 });
    gsap.set(this.navBg, { display: 'block', opacity: 0});
    gsap.to(this.navBg, { duration: this.animationTime, ease: "power3.out", opacity: .5 });

    // hamburger
    gsap.to('.hamburgerLine1', { duration: .3, ease: "power3.out", y: '-50%', rotate: '45deg' });
    gsap.to('.hamburgerLine2', { duration: .3, ease: "power3.out", opacity: 0 });
    gsap.to('.hamburgerLine3', { duration: .3, ease: "power3.out", y: '-50%', rotate: '-45deg' });
  }
  headerClose(){
    this.navFlag = false;
    this.body.style.overflow = 'visible';

    // nav
    gsap.to(this.nav, { duration: this.animationTime, ease: "power3.out", display: 'none', opacity: 0, x: '20%'});
    gsap.to(this.navBg, { duration: this.animationTime, ease: "power3.out", display: 'none', opacity: 0});

    // hamburger
    gsap.to('.hamburgerLine1', { duration: .3, ease: "power3.out", y: '-550%', rotate: 0 });
    gsap.to('.hamburgerLine2', { duration: .3, ease: "power3.out", opacity: 1 });
    gsap.to('.hamburgerLine3', { duration: .3, ease: "power3.out", y: '450%', rotate: 0 });
  }

  topButton(){
    const topButton = document.getElementById('topButton');
    topButton.addEventListener("click", () => {
      gsap.set( window, {scrollTo: { y: 200}});
      gsap.to( window, {duration: 0.85,ease: 'power4.out',scrollTo: { y: 0}});
    });
  }
}
