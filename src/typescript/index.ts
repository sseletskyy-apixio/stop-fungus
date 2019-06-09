import SimpleParallax from 'simple-parallax-js'
import { simpleParallaxConfig } from "./common";
function init () {
  const images = document.querySelectorAll('.parallax-img')
  images.forEach(img => {
    new SimpleParallax(img, simpleParallaxConfig)
  })


  const NAV = $('nav.navbar')
  const FIXED_CLASS = 'fixed-nav'
  const TOGGLE_HEIGHT = $('#home').height() * .9

  $(window).scroll(function() {
    if( $(window).scrollTop() > TOGGLE_HEIGHT ) {
      NAV.addClass(FIXED_CLASS);
    } else {
      NAV.removeClass(FIXED_CLASS);
    }
  });
}
window.addEventListener('load', init, false);
