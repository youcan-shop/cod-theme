/* ------------------ */
/* ----- navbar ----- */
/* ------------------ */
const navFixed = document.querySelector('.nav-fixed');
const noticeMobile = document.querySelector('.yc-notice.mobile');
const overlay = document.querySelector('.global-overlay');
const drawer = document.querySelector('.navbar-drawer');
const drawerBtn = document.querySelector('.close-drawer-btn');
const closeSearchBtn = document.querySelector('.close-search');
const menuCloseIcon = document.querySelector('#nav-menu-open');
const menuOpenIcon = document.querySelector('#nav-menu-close');

function makeNavbarFixed() {
  document.body.style.paddingTop = `${navFixed.offsetHeight}px`;
  navFixed.classList.add('fixed');
  if (noticeMobile) noticeMobile.style.display = 'none';
}

function makeNavbarStatic() {
  document.body.style.paddingTop = '';
  navFixed.classList.remove('fixed');
  if (noticeMobile) noticeMobile.style.display = '';
}

function handleScroll() {
  if (navFixed) {
    const navbarHeight = navFixed.offsetHeight;
    const scrollTop = window.scrollY || window.pageYOffset;

    scrollTop >= navbarHeight ? makeNavbarFixed() : makeNavbarStatic();
  }
}

function toggleDrawerIcon() {
  if (menuCloseIcon && menuOpenIcon) {
    menuCloseIcon.style.display = menuCloseIcon.style.display === 'none' ? 'block' : 'none';
    menuOpenIcon.style.display = menuOpenIcon.style.display === 'none' ? 'block' : 'none';

    // check if drawer is open, if yes, close it
    if (menuOpenIcon.style.display === 'none') {
      closeDrawer();
    }
  }
}

function showOverlay() {
  overlay.style.visibility = 'visible';
  overlay.style.opacity = '1';
}

function closeDrawer() {
  document.body.style.overflowY = 'auto';
  drawer.style.position = 'fixed';
  overlay.style.opacity = '0';
  drawer.style.transform = 'translateY(-100%)';

  if (menuCloseIcon && menuOpenIcon) {
    menuCloseIcon.style.display = 'block';
    menuOpenIcon.style.display = 'none';
  }
}

function hideOverlay() {
  if (drawerBtn) drawerBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeDrawer();
    }
  });
}

function openDrawer(el) {
  const targetedDrawer = document.querySelector(`.navigation-drawer${el}`);
  const navbar = document.querySelector('.yc-navbar');

  if (targetedDrawer) {
    showOverlay();
    targetedDrawer.style.transform = 'none';
    targetedDrawer.style.opacity = '1';

    if (navbar && noticeMobile) targetedDrawer.style.position = 'relative';
    document.body.style.overflowY = 'hidden';
    toggleDrawerIcon();
  }
}

if (navFixed) {
  handleScroll();
  window.addEventListener('scroll', handleScroll);
}

if (overlay) hideOverlay();

/* ------------------ */
/* ----- search ----- */
/* ------------------ */
const searchHolder = document.getElementById('searchInputHolder');

const openSearch = () => {
  const noticeBar = document.querySelector('.yc-notice');
  const noticeHeight = noticeBar ? noticeBar.offsetHeight : 0;

  if (!overlay || !searchHolder) return;

  overlay.style.top = `${noticeHeight}px`;
  overlay.style.opacity = '1';
  overlay.style.visibility = 'visible';

  searchHolder.style.opacity = '1';
  searchHolder.style.visibility = 'visible';
  document.body.style.overflowY = 'hidden';
};

const closeSearch = () => {
  if (!overlay || !searchHolder) return;

  overlay.style.top = '0';
  overlay.style.opacity = '0';
  overlay.style.visibility = 'hidden';
  overlay.style.height = '100vh';

  searchHolder.style.opacity = '0';
  searchHolder.style.visibility = 'hidden';
  document.body.style.overflowY = 'auto';
};

overlay.addEventListener('click', () => closeSearch());
closeSearchBtn.addEventListener('click', () => closeSearch());


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

  desktopStickyElements(elementsContainer);
})();

function desktopStickyElements(elementsContainer) {
  const elementsWrapper = document.createElement('div');
  const emptySpacer = document.createElement('div');

  elementsWrapper.classList.add('sticky-elements-wrapper');
  emptySpacer.classList.add('sticky-empty-spacer');
  elementsWrapper.appendChild(elementsContainer);
  elementsWrapper.appendChild(emptySpacer);
  document.body.append(elementsWrapper);

  if (window.matchMedia("(min-width: 768px)").matches) {
    elementsWrapper.classList.add('container');
  }

  window.addEventListener('resize', () => {
    if(window.innerWidth >= 768) {
      elementsWrapper.classList.add('container');
    } else if(window.innerWidth < 768) {
      elementsWrapper.classList.remove('container');
    }
  })
}

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
