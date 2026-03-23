let InteractionJS = {

  bigImgEl : null,
  numImgs : null,

  init : function() {
    setTimeout(InteractionJS.initNavbar, 10);

    // Shorten the navbar after scrolling a little bit down
    window.addEventListener('scroll', function() {
      const navbar = document.querySelector('.navbar');
      if (navbar.getBoundingClientRect().top + window.scrollY > 50) {
        navbar.classList.add('top-nav-short');
      } else {
        navbar.classList.remove('top-nav-short');
      }
    });

    // On mobile, hide the avatar when expanding the navbar menu
    const mainNavbar = document.getElementById('main-navbar');
    if (mainNavbar) {
      mainNavbar.addEventListener('show.bs.collapse', function() {
        document.querySelector('.navbar').classList.add('top-nav-expanded');
      });
      mainNavbar.addEventListener('hidden.bs.collapse', function() {
        document.querySelector('.navbar').classList.remove('top-nav-expanded');
      });
    }

    // show the big header image
    InteractionJS.initImgs();

    InteractionJS.initSearch();

    InteractionJS.initDarkMode();
  },

  initNavbar : function() {
    // Set the navbar-dark/light class based on its background color
    const navbar = document.querySelector('.navbar');
    const bgColor = getComputedStyle(navbar).backgroundColor;
    const rgb = bgColor.replace(/[^\d,]/g, '').split(',');
    const brightness = Math.round((
      parseInt(rgb[0]) * 299 +
      parseInt(rgb[1]) * 587 +
      parseInt(rgb[2]) * 114
    ) / 1000);
    if (brightness <= 125) {
      navbar.classList.remove('navbar-light');
      navbar.classList.add('navbar-dark');
    } else {
      navbar.classList.remove('navbar-dark');
      navbar.classList.add('navbar-light');
    }
  },

  initImgs : function() {
    // If the page was large images to randomly select from, choose an image
    const headerBigImgs = document.getElementById('header-big-imgs');
    if (headerBigImgs) {
      InteractionJS.bigImgEl = headerBigImgs;
      InteractionJS.numImgs = parseInt(headerBigImgs.getAttribute('data-num-img'));

      // set an initial image
      const imgInfo = InteractionJS.getImgInfo();
      const src = imgInfo.src;
      const desc = imgInfo.desc;
      InteractionJS.setImg(src, desc);

      // For better UX, prefetch the next image so that it will already be loaded when we want to show it
      const getNextImg = function() {
        const imgInfo = InteractionJS.getImgInfo();
        const src = imgInfo.src;
        const desc = imgInfo.desc;

        const prefetchImg = new Image();
        prefetchImg.src = src;

        setTimeout(function(){
          const img = document.createElement('div');
          img.classList.add('big-img-transition');
          img.style.backgroundImage = 'url(' + src + ')';
          const introHeader = document.querySelector('.intro-header.big-img');
          if (introHeader) {
            introHeader.prepend(img);
          }
          setTimeout(function(){ img.style.opacity = '1'; }, 50);

          setTimeout(function() {
            InteractionJS.setImg(src, desc);
            img.remove();
            getNextImg();
          }, 1000);
        }, 4000);
      };

      // If there are multiple images, cycle through them
      if (InteractionJS.numImgs > 1) {
        getNextImg();
      }
    }
  },

  getImgInfo : function() {
    const randNum = Math.floor((Math.random() * InteractionJS.numImgs) + 1);
    const src = InteractionJS.bigImgEl.getAttribute('data-img-src-' + randNum);
    const desc = InteractionJS.bigImgEl.getAttribute('data-img-desc-' + randNum);

    return {
      src : src,
      desc : desc
    }
  },

  setImg : function(src, desc) {
    const introHeader = document.querySelector('.intro-header.big-img');
    if (introHeader) {
      introHeader.style.backgroundImage = 'url(' + src + ')';
    }
    const imgDesc = document.querySelector('.img-desc');
    if (imgDesc) {
      if (desc !== undefined && desc !== null && desc !== false) {
        imgDesc.textContent = desc;
        imgDesc.style.display = '';
      } else {
        imgDesc.style.display = 'none';
      }
    }
  },

  initSearch : function() {
    if (!document.getElementById('search-overlay')) {
      return;
    }

    const searchLink = document.getElementById('nav-search-link');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('nav-search-input');
    const searchExit = document.getElementById('nav-search-exit');

    if (searchLink) {
      searchLink.addEventListener('click', function(e) {
        e.preventDefault();
        searchOverlay.style.display = '';
        searchInput.focus();
        searchInput.select();
        document.body.classList.add('overflow-hidden');
      });
    }
    if (searchExit) {
      searchExit.addEventListener('click', function(e) {
        e.preventDefault();
        searchOverlay.style.display = 'none';
        document.body.classList.remove('overflow-hidden');
      });
    }
    document.addEventListener('keyup', function(e) {
      if (e.key === 'Escape') {
        searchOverlay.style.display = 'none';
        document.body.classList.remove('overflow-hidden');
      }
    });
  },

  initDarkMode : function() {
    const toggle = document.getElementById('dark-mode-toggle');
    if (!toggle) return;

    // Determine initial theme: localStorage > OS preference > light
    const stored = localStorage.getItem('theme');
    let theme;
    if (stored) {
      theme = stored;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'dark';
    } else {
      theme = 'light';
    }

    InteractionJS.applyTheme(theme);

    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      const current = document.documentElement.getAttribute('data-bs-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      InteractionJS.applyTheme(next);
      // Re-evaluate navbar brightness after theme change
      setTimeout(InteractionJS.initNavbar, 10);
    });
  },

  applyTheme : function(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);

    // Update toggle icon
    const toggle = document.getElementById('dark-mode-toggle');
    if (toggle) {
      const icon = toggle.querySelector('span');
      if (icon) {
        icon.className = theme === 'dark' ? 'fa fa-sun' : 'fa fa-moon';
      }
    }

    // Update mobile theme-color meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#16213e' : '{{ site.mobile-theme-col | default: "#738573" }}');
    }
  }
};

document.addEventListener('DOMContentLoaded', InteractionJS.init);
