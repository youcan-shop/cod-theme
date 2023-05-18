/* ------------------ */
/* ----- navbar ----- */
/* ------------------ */
const fixedNavbar = document.querySelector('.nav-fixed');
const notice = document.querySelector('.yc-notice');

const makeNavbarFixed = () => {
  document.body.style.paddingTop = fixedNavbar.offsetHeight + 'px';
  fixedNavbar.classList.add('fixed');
};

const makeNavbarStatic = () => {
  document.body.style.paddingTop = '0';
  fixedNavbar.classList.remove('fixed');
};

function toggleNavbar() {
  if (window.scrollY >= fixedNavbar.offsetHeight + notice.offsetHeight) {
    makeNavbarFixed();
  } else {
    makeNavbarStatic();
  }
}

if (fixedNavbar && notice) {
  toggleNavbar();
  window.addEventListener('scroll', toggleNavbar);
}

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

/* ----------------------------- */
/* ----- navigation-drawer ----- */
/* ----------------------------- */
const overlay = document.querySelector('.global-overlay');
const drawers = document.querySelectorAll('.navigation-drawer');

const showOverlay = () => {
  document.body.style.overflowY = 'hidden';
  overlay.style.visibility = 'visible';
  overlay.style.opacity = '1';
}

const hideOverlay = () => {
  const drawerBtn = document.querySelector('.close-drawer-btn');

  const closeDrawer = () => {
    document.body.style.overflowY = 'auto';
    overlay.style.visibility = 'hidden';
    overlay.style.opacity = '0';
    drawers.forEach((drawer) => {
      drawer.style.transform = 'translateX(150vw)';
    })
  };

  if (drawerBtn) {
    drawerBtn.addEventListener('click', closeDrawer);
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeDrawer();
    }
  });
};

if (overlay) {
  hideOverlay();
}

function openDrawer(el) {
  const targetedDrawer = document.querySelector(`.navigation-drawer${el}`);
  if (targetedDrawer) {
    showOverlay();
    targetedDrawer.style.transform = 'none';
    targetedDrawer.style.opacity = '1';
  }
}

/* ------------------ */
/* ----- search ----- */
/* ------------------ */
const searchHolder = document.getElementById('searchInputHolder');
let noticeHeight = notice?.offsetHeight;

function openSearch() {
  const isNavBarFixed = fixedNavbar?.classList.contains('fixed');
  noticeHeight = isNavBarFixed ? 0 : notice?.offsetHeightconsole;

  if (!overlay) return;

  overlay.style.height = `calc(100vh + ${noticeHeight || 0}px)`;
  overlay.style.top = `${noticeHeight || 0}px`;
  overlay.style.opacity = '1';
  overlay.style.visibility = 'visible';

  if (!searchHolder) return;

  searchHolder.style.opacity = '1';
  searchHolder.style.visibility = 'visible';
  searchHolder.style.top = `${noticeHeight || 0}px`;
}

function closeSearch() {
  if (!overlay) return;

  overlay.style.opacity = '0';
  overlay.style.visibility = 'hidden';
  overlay.style.height = '100vh';

  if (!searchHolder) return;

  searchHolder.style.opacity = '0';
  searchHolder.style.visibility = 'hidden';
}

overlay.addEventListener('click', closeSearch);

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
