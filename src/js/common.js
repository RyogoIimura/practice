import gsap from 'gsap'
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger";
window.gsap = gsap
gsap.registerPlugin(ScrollToPlugin)
gsap.registerPlugin(ScrollTrigger);
import Header from './_common/Header';
import Footer from './_common/Footer';


const loaded = () => {
  Header();
  Footer();
};

window.addEventListener('load', loaded);
