/* ----- Store currency ----- */
const currencyCode = window.Dotshop.currency;
/* ------------------ */
/* ----- navbar ----- */
/* ------------------ */
const fixedNavbar = document.querySelector('.nav-fixed');
const notice = document.querySelector('.yc-notice');
const closeSearchBtn = document.getElementById('close-search-btn');
const navMenuVariables = {
  menuButton: document.getElementById('menuButton'),
  mobileMenu: document.getElementById('mobile-menu'),
  header: document.querySelector('.yc-header'),
  headerWrapper: document.querySelector('.header-wrapper'),
};
let noticeHeight = notice ? notice.offsetHeight : '0';

const makeNavbarFixed = () => {
  document.body.style.paddingTop = fixedNavbar.offsetHeight + 'px';
  fixedNavbar.classList.add('fixed');
};

const makeNavbarStatic = () => {
  document.body.style.paddingTop = '0';
  fixedNavbar.classList.remove('fixed');
};

function toggleNavbar() {
  if (window.scrollY >= fixedNavbar.offsetHeight + Number(noticeHeight)) {
    makeNavbarFixed();
  } else {
    makeNavbarStatic();
  }
}

toggleNavbar();
window.addEventListener('scroll', toggleNavbar);

/* -------------------------- */
/* ----- spinner-loader ----- */
/* -------------------------- */
function load(el) {
  const loader = document.querySelector(el);
  if (loader) {
    loader.classList.remove('hidden');
  }

  const nextEl = loader ? loader.nextElementSibling : null;

  if (nextEl) {
    nextEl.classList.add('hidden');
  }
}

function stopLoad(el) {
  const loader = document.querySelector(el);
  if (loader) {
    loader.classList.add('hidden');
  }

  const nextEl = loader ? loader.nextElementSibling : null;
  if (nextEl) {
    nextEl.classList.remove('hidden');
  }
}

/* ----------------- */
/* ----- alert ----- */
/* ----------------- */
function notify(msg, type = 'success', timeout = 3000) {
  const alert = document.querySelector('.yc-alert');
  if (!alert) return;

  const icons = alert.querySelectorAll('.icon');
  if (!icons || !icons.length) return;

  const alertClassList = alert.classList.value;

  icons.forEach((icon) => icon.style.display = 'none');
  alert.querySelector(`.icon-${type}`).style.display = 'block';
  alert.querySelector('.alert-msg').innerText = msg;

  alert.classList.add(type);
  alert.classList.add('show');

  setTimeout(() => alert.setAttribute('class', alertClassList), timeout);
}

/* ------------------- */
/* ----- Overlay ----- */
/* ------------------- */
const overlay = document.querySelector('.global-overlay');

const showOverlay = () => {
  document.body.style.overflowY = 'hidden';
  overlay.style.visibility = 'visible';
  overlay.style.opacity = '1';
}

const hideOverlay = () => {
  document.body.style.overflowY = 'auto';
  overlay.style.visibility = 'hidden';
  overlay.style.opacity = '0';
};

overlay.addEventListener('click', (e) => {
  const cartDrawer = document.querySelector('.cart-drawer');

  if (e.target === overlay) {
    hideOverlay();
    closeMenu();

    if(cartDrawer && cartDrawer.classList.contains('open')) {
      cartDrawer.classList.remove('open');
      navMenuVariables.header.classList.remove('hide');
    }
  }
});
/* ----------------------------- */
/* ----- mobile navigation ----- */
/* ----------------------------- */
function closeMenu () {
  if(navMenuVariables.headerWrapper.classList.contains('open')) {
    navMenuVariables.headerWrapper.classList.remove('open');
    navMenuVariables.mobileMenu.classList.remove('is-open');
    navMenuVariables.menuButton.classList.remove('close');
  }
};

// Toggle Menu
navMenuVariables.menuButton.addEventListener('click', () => {
  navMenuVariables.menuButton.classList.toggle('close');

  if (navMenuVariables.mobileMenu) {
    navMenuVariables.mobileMenu.classList.toggle('is-open');

    if (navMenuVariables.mobileMenu.classList.contains('is-open')) {
      showOverlay();
      navMenuVariables.headerWrapper.classList.add('open');
    } else {
      closeMenu();
      hideOverlay();
    }
  }
})
/* ------------------ */
/* ----- search ----- */
/* ------------------ */
const searchHolder = document.getElementById('searchInputHolder');

function openSearch() {
  const searchInput = document.querySelector('.search-input');
  const isNavBarFixed = fixedNavbar?.classList.contains('fixed');

  if(notice) {
    searchHolder.style.top = `${noticeHeight}px`;
  }

  if(isNavBarFixed) {
    searchHolder.style.top = '0';
  }

  setTimeout(closeMenu, 100);

  if (!overlay) return;
  showOverlay();

  if (!searchHolder) return;

  searchHolder.style.opacity = '1';
  searchHolder.style.visibility = 'visible';
  document.body.style.overflow = "hidden";
  searchInput.focus();
}

function closeSearch() {
  if (!overlay) return;
  hideOverlay();

  if (!searchHolder) return;

  searchHolder.style.opacity = '0';
  searchHolder.style.visibility = 'hidden';
}

overlay.addEventListener('click', closeSearch);
closeSearchBtn.addEventListener('click', closeSearch);

/* ---------------------------------------------- */
/* ----- Group Sticky elements in one place ----- */
/* ---------------------------------------------- */
(function groupStickyElements() {
  const elements = document.querySelectorAll('.is_sticky');

  if (!elements || !elements.length) return;

  const elementsContainer = document.createElement('div');
  elementsContainer.classList.add('sticky-elements-container');

  elements.forEach((element) => {
    elementsContainer.appendChild(element);
  });

  document.body.append(elementsContainer);
})();

/* ------------------------------------------------------ */
/* ----- Stick the footer at the bottom of the page ----- */
/* ------------------------------------------------------ */

/**
 * This function is for always putting the footer at the bottom of the screen
 */

function stickFooterAtBottom() {
  const stickFooter = $('#stick-footer');
  let htmlPageHeight = document.documentElement.clientHeight;
  let bodyHeight = document.body.offsetHeight;
  let emptySpaceHeight = `${htmlPageHeight - bodyHeight}px`;

  if (emptySpaceHeight < '0px') {
    emptySpaceHeight = '32px';
  }

  if (stickFooter) {
    stickFooter.style.marginBottom = emptySpaceHeight;
  }
}

stickFooterAtBottom();

/* ------------------------------------------------------ */
/* ----- Display each video section -------------------- */
/* ------------------------------------------------------ */
function processVideoSections() {
  const videoSections = document.querySelectorAll('.video-wrapper');

  if (!videoSections || !videoSections.length) return;

  videoSections.forEach((video) => {
    const facebookVideo = video.querySelector('.facebook-video');
    const youtubeVideo = video.querySelector('.youtube-video');
    const width = video.getAttribute('data-video-width') * (window.innerWidth / 100);
    const height =  video.getAttribute('data-video-height');
    const videoUrl=  video.getAttribute('data-video-link');

    function getBestThumbnailUrl(videoId) {
      return new Promise((resolve) => {
        const img = new Image();
        const maxResUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

        img.onload = () => {
          resolve(maxResUrl);
        };

        img.onerror = () => {
          resolve(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
        };

        img.src = maxResUrl;
      });
    }

    function extractYouTubeVideoId(url) {
      const regex = /(?:v=|youtu\.be\/)([^&]+)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    }

    async function initializeYouTubeVideo(youtubeVideo) {
      const spinner = youtubeVideo.querySelector('.spinner');
      const videoId = extractYouTubeVideoId(videoUrl);
      youtubeVideo.style.width = width + 'px';
      youtubeVideo.style.height = height + 'px';
      const youtubeThumbnail = youtubeVideo.querySelector('.youtube-thumbnail');
      const youtubePlayButton = youtubeVideo.querySelector('.youtube-play-button');

      const thumbnailUrl = await getBestThumbnailUrl(videoId);
      youtubeThumbnail.src = thumbnailUrl;

      const iframe = document.createElement('iframe');
      iframe.width = width;
      iframe.height = height;
      iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.display = 'none';
      youtubeVideo.appendChild(iframe);

      youtubeVideo.addEventListener('click', function () {
        youtubeThumbnail.style.display = 'none';
        youtubePlayButton.style.display = 'none';
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1`;
        iframe.style.display = 'block';
        spinner.style.display = 'block';

        iframe.addEventListener('load', function () {
          spinner.style.display = 'none';
        });
      });
    }

    document.addEventListener('DOMContentLoaded', async function () {
      if (youtubeVideo) {
        await initializeYouTubeVideo(youtubeVideo);
      } else if (facebookVideo) {
        facebookVideo.width = width;
        facebookVideo.height = height;
        facebookVideo.src = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoUrl)}`;
      }
    });
  });
}

processVideoSections();
