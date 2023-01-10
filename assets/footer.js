const parsedLinks = document.querySelectorAll('.parsed-links');

parsedLinks.forEach((parsedLink) => {
  const links = parsedLink.querySelectorAll('a');
  links.forEach((link, index) => {
    if (index % 2 === 0) {
      link.setAttribute('href', links[index + 1].innerText);
      links[index + 1].remove();
    }
  });
});

const placeFooterAtTheBottom = () => {
  const footer = document.querySelector('.yc-footer');
  
  if (!footer) return;
  
  const footerHeight = footer.offsetHeight;
  document.body.style.paddingBottom = `${footerHeight + 100}px`;
  footer.style.position = 'absolute';
  footer.style.bottom = 0;
}

// placeFooterAtTheBottom();
// window.addEventListener('resize', placeFooterAtTheBottom);
