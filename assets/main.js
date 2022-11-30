/* ----------------------------- */
/* ----- navigation-drawer ----- */
/* ----------------------------- */
const overlay = document.querySelector('.global-overlay')
const drawer = document.querySelector('.navigation-drawer')

if (overlay) {
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      overlay.style.visibility = 'hidden'
      overlay.style.opacity = '0'
      drawer.style.transform = 'translateX(-100%)'
    }
  });
}

function openDrawer(el) {
  const targetedDrawer = document.querySelector(`.navigation-drawer${el}`)
  if (targetedDrawer) {
    overlay.style.visibility = 'visible'
    overlay.style.opacity = '1'
    targetedDrawer.style.transform = 'none'
    targetedDrawer.style.opacity = '1'
  }
}

/* ------------------ */
/* ----- search ----- */
/* ------------------ */
const searchHolder = document.getElementById('searchInputHolder')

function openSearch() {
  overlay.style.height = 'calc(100vh - var(--yc-notice-height))'
  overlay.style.top = 'var(--yc-notice-height)'
  overlay.style.opacity = '1'
  overlay.style.visibility = 'visible'
  searchHolder.style.opacity = '1'
  searchHolder.style.visibility = 'visible'
}

function closeSearch() {
  overlay.style.opacity = '0'
  overlay.style.visibility = 'hidden'
  overlay.style.height = '100vh'
  searchHolder.style.opacity = '0'
  searchHolder.style.visibility = 'hidden'
}

overlay.addEventListener('click', closeSearch)