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
