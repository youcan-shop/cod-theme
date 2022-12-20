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

  if (type === 'success') {
    alert.querySelector('.icon-error').style.display = 'none';
    alert.querySelector('.icon-success').style.display = 'block';
  } else {
    alert.querySelector('.icon-error').style.display = 'block';
    alert.querySelector('.icon-success').style.display = 'none';
  }

  alert.querySelector('.alert-msg').innerText = msg;
  alert.classList.add('show');
  setTimeout(() => alert.classList.remove('show'), timeout);
}

/* ----------------------------- */
/* ----- navigation-drawer ----- */
/* ----------------------------- */
const overlay = document.querySelector('.global-overlay');
const drawer = document.querySelector('.navigation-drawer');

if (overlay) {
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      overlay.style.visibility = 'hidden';
      overlay.style.opacity = '0';
      drawer.style.transform = 'translateX(-150vw)';
    }
  });
}

function openDrawer(el) {
  const targetedDrawer = document.querySelector(`.navigation-drawer${el}`);
  if (targetedDrawer) {
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
    targetedDrawer.style.transform = 'none';
    targetedDrawer.style.opacity = '1';
  }
}

/* ------------------ */
/* ----- search ----- */
/* ------------------ */
const searchHolder = document.getElementById('searchInputHolder');
const noticeHeight = notice?.offsetHeight;

function openSearch() {
  if (overlay) return;
  overlay.style.height = `calc(100vh + ${noticeHeight || 0}px)`;
  overlay.style.top = `${noticeHeight || 0}px`;
  overlay.style.opacity = '1';
  overlay.style.visibility = 'visible';

  if (searchHolder) return;
  searchHolder.style.opacity = '1';
  searchHolder.style.visibility = 'visible';
  searchHolder.style.top = `${noticeHeight || 0}px`;
}

function closeSearch() {
  if (overlay) return;
  overlay.style.opacity = '0';
  overlay.style.visibility = 'hidden';
  overlay.style.height = '100vh';

  if (searchHolder) return;
  searchHolder.style.opacity = '0';
  searchHolder.style.visibility = 'hidden';
}

overlay.addEventListener('click', closeSearch);
