import gsap from 'gsap'
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger";

window.gsap = gsap
gsap.registerPlugin(ScrollToPlugin)
gsap.registerPlugin(ScrollTrigger);

import CommonUi from './_common/CommonUi';

const loaded = () => {
  const commonUi = new CommonUi();
  commonUi.init();
};

window.addEventListener('load', loaded);
