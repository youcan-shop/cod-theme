/* ------------------ */
/* ----- navbar ----- */
/* ------------------ */
const fixedNavbar = document.querySelector('.nav-fixed');
const notice = document.querySelector('.yc-notice');
const noticeOnDesktop = document.querySelector('.yc-notice.desktop');
const noticeOnMobile = document.querySelector('.yc-notice.mobile');

function makeNavbarFixed() {
  document.body.style.paddingTop = `${fixedNavbar.offsetHeight}px`;
  fixedNavbar.classList.add('fixed');
  if (noticeOnMobile) {
    noticeOnMobile.style.display = 'none';
  }
}

function makeNavbarStatic() {
  document.body.style.paddingTop = '';
  fixedNavbar.classList.remove('fixed');
  if (noticeOnMobile) {
    noticeOnMobile.style.display = '';
  }
}

function handleScroll() {
  if (fixedNavbar && noticeOnDesktop) {
    const navbarHeight = fixedNavbar.offsetHeight;
    const noticeHeight = noticeOnDesktop.offsetHeight;
    const scrollTop = window.scrollY || window.pageYOffset;

    if (scrollTop >= navbarHeight + noticeHeight) {
      makeNavbarFixed();
    } else {
      makeNavbarStatic();
    }
  }
}

if (fixedNavbar && noticeOnDesktop) {
  handleScroll();
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleScroll);
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
const drawer = document.querySelector('.navbar-drawer');
const menuIcon = document.querySelector('.menu-toggler ion-icon');
const drawerBtn = document.querySelector('.close-drawer-btn');
const closeSearchBtn = document.querySelector('.close-search');

const toggleDrawerIcon = () => {
  if (menuIcon.getAttribute('name') === 'menu-outline') {
    menuIcon.setAttribute('name', 'close-outline');
  } else {
    menuIcon.setAttribute('name', 'menu-outline');
    closeDrawer();
  }
};

const showOverlay = () => {
  overlay.style.visibility = 'visible';
  overlay.style.opacity = '1';
};

const closeDrawer = () => {
  document.body.style.overflowY = 'auto';
  overlay.style.opacity = '0';
  drawer.style.transform = 'translateY(-100%)';
  drawer.style.marginTop = '0';
};

const hideOverlay = () => {
  if (drawerBtn) {
    drawerBtn.addEventListener('click', closeDrawer);
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeDrawer();
    }
  });
};

const openDrawer = (el) => {
  const targetedDrawer = document.querySelector(`.navigation-drawer${el}`);
  const navbar = document.querySelector('.yc-navbar');

  if (targetedDrawer) {
    showOverlay();
    targetedDrawer.style.transform = 'none';
    targetedDrawer.style.opacity = '1';

    if (navbar && noticeOnMobile) {
      targetedDrawer.style.marginTop = `${navbar.offsetHeight + noticeOnMobile.offsetHeight}px`;
    }
    toggleDrawerIcon();
  }
};

if (overlay) {
  hideOverlay();
  overlay.addEventListener('click', toggleDrawerIcon);
}

/* ------------------ */
/* ----- search ----- */
/* ------------------ */
const searchHolder = document.getElementById('searchInputHolder');

function openSearch() {
  const isNavBarFixed = fixedNavbar?.classList.contains('fixed');
  noticeHeight = isNavBarFixed ? 0 : notice?.offsetHeightconsole;

  if (!overlay) return;

  overlay.style.height = `calc(100vh + ${noticeHeight || 0}px)`;
  overlay.style.opacity = '1';
  overlay.style.visibility = 'visible';

  if (!searchHolder) return;

  searchHolder.style.opacity = '1';
  searchHolder.style.visibility = 'visible';
  document.body.style.overflowY = 'hidden';
}

function closeSearch() {
  if (!overlay) return;

  overlay.style.opacity = '0';
  overlay.style.visibility = 'hidden';
  overlay.style.height = '100vh';

  if (!searchHolder) return;

  searchHolder.style.opacity = '0';
  searchHolder.style.visibility = 'hidden';
  document.body.style.overflowY = 'auto';
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
