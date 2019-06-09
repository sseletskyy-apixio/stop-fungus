(function () {
  function removeLoading() {
    window.setTimeout(function () {
      const body = document.body;
      body.classList.add('loaded');
      body.classList.remove("loading");
    }, 300);
  }

  const SCROLL_DURATION = 450;

  function scrollTo(yOffset = 0) {
    const scrollHeight = window.pageYOffset;
    const scrollStep = Math.PI / (SCROLL_DURATION / 15);
    const cosParameter = Math.abs(scrollHeight - yOffset) / 2;
    let scrollCount = 0;
    let scrollMargin;
    let scrollInterval = scrollHeight > yOffset
        ? setInterval(function () {
          if (window.pageYOffset > yOffset) {
            scrollCount = scrollCount + 1;
            scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
            window.scrollTo(0, (scrollHeight - scrollMargin));
          }
          else clearInterval(scrollInterval);
        }, 15)
        : setInterval(function () {
          if (window.pageYOffset < yOffset) {
            scrollCount = scrollCount + 1;
            scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
            window.scrollTo(0, (scrollHeight + scrollMargin));
          }
          else {
            clearInterval(scrollInterval);
          }
        }, 15);
    setTimeout(() => {clearInterval(scrollInterval)}, SCROLL_DURATION)
    return true;
  }

  function pageOneParallaxEffect(selector) {
    selector && window.addEventListener('scroll', function () {
      let scrolled = window.pageYOffset;
      const page1 = document.querySelector(selector);
      page1.style.backgroundPositionX = `${scrolled * 0.7}px`;
    });
  }

  function replaceImgSrc() {
    const reg = new RegExp('src="([^"]*).*data-src="([^"]*)')
    const imgDefer = Array.from(document.getElementsByTagName('img'));
    const replacementObj = Array.from(document.querySelectorAll('noscript')).reduce((acc, next) => {
      next.textContent.split('<img')
          .map(x => {
            const match = reg.exec(x)
            if (Array.isArray(match) && match.length > 2) {
              const [src, dataSrc] = match.slice(1)
              acc[dataSrc] = src
            }
          })
      return acc;
    }, {});
    imgDefer.forEach(img => {
      let dataSrc = img.getAttribute('data-src');
      if (dataSrc && replacementObj[dataSrc]) {
        img.setAttribute('src', replacementObj[dataSrc]);
        img.onload = (function(img) { return () => {
          $(img).removeClass('img-blurred')
        }})(img)
      }
    })
  }

  function getTopOffset(el) {
    return el.offsetTop - el.scrollTop;
  }

  function animateScrolling() {
    const pages = Array.from(document.querySelectorAll('div.section[id]'));

    /*
    function keyUpListener(e) {
      let st = window.pageYOffset || document.documentElement.scrollTop;
      const offsets = findPageVerticalOffsets(pages);
      let nearestPageOffset;
      if (e.code === 'ArrowDown') {
        nearestPageOffset = Math.min.apply(null, offsets.filter(offset => offset > st));
      } else if (e.code === 'ArrowUp') {
        nearestPageOffset = Math.max.apply(null, offsets.filter(offset => offset < st));
      }
      if (Number.isFinite(nearestPageOffset)) {
        window.removeEventListener('keyup', keyUpListener, false);
        setTimeout(() => scrollTo(nearestPageOffset), 0);
        setTimeout(() => window.addEventListener("keyup", keyUpListener, false), SCROLL_DURATION * 2);
      }
    }
    window.addEventListener("keyup", keyUpListener, false);
    */

    const scrollToHandler = (el) => () => {
      const offsets = findPageVerticalOffsetsAsObject(pages);
      const newHash = `#${el.dataset.scrollto}`
      if (history.pushState) {
        history.pushState(null, null, newHash);
      }
      else {
        location.hash = newHash;
      }
      scrollTo(offsets[el.dataset.scrollto]);
    };

    Array.from(document.querySelectorAll('a[data-scrollto]')).forEach(el => {
      el.addEventListener('click', scrollToHandler(el), false)
    })

  }

  function findPageVerticalOffsets(pages) {
    return pages.map(el => getTopOffset(el))
  }

  function findPageVerticalOffsetsAsObject(pages) {
    return pages.reduce((acc, el) => {
      acc[el.id] = getTopOffset(el);
      return acc
    }, {})
  }


  function verticalParallax () {
    const parallaxEls = document.querySelectorAll("[data-speed]");
    window.addEventListener("scroll", scrollHandler);

    function scrollHandler() {
      for (const parallaxEl of parallaxEls) {
        const direction = parallaxEl.dataset.direction == "up" ? "-" : "";
        const transformY = this.pageYOffset * parallaxEl.dataset.speed;
        if (parallaxEl.classList.contains("banner-title")) {
          parallaxEl.style.transform = `translate3d(0,${direction}${transformY}px,0) rotate(-${parseFloat(this.pageYOffset / 10)}deg)`;
        } else if (parallaxEl.classList.contains("banner-subtitle")) {
          parallaxEl.style.transform = `translate3d(0,${direction}${transformY}px,0) rotate(-3deg)`;
        } else {
          parallaxEl.style.transform = `translate3d(0,${direction}${transformY}px,0)`;
        }
      }
    }

  };

  function init() {
    removeLoading();
    // pageOneParallaxEffect('.berserker-background .before');
    replaceImgSrc();
    animateScrolling();
    verticalParallax();
  }

  // window.onload = init;
  window.addEventListener('load', init, false);
})();

/*
Object.defineProperty( Element.prototype, 'documentOffsetTop', {
get: function () {
return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop : 0 );
}
} );
// var x = document.getElementById( 'myDiv' ).documentOffsetTop
 */
