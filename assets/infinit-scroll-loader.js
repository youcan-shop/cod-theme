const infinitScrollParent = document.getElementById('infinit-scroll-loader');
const loaderContainer = document.getElementById('loader-container');
const loadMoreButton = document.getElementById('loader-button');
let startIndex = 6;
const itemsPerLoad = 6;
const child = infinitScrollParent.children;
const totalChildren = child.length;

if (totalChildren > itemsPerLoad) {
  for (let i = itemsPerLoad; i < totalChildren; i++) {
    child[i].style.display = 'none';
    loaderContainer.style.display = 'block';
  }
}

function loadMore() {
  const endIndex = Math.min(startIndex + itemsPerLoad, totalChildren);

  for (let i = startIndex; i < endIndex; i++) {
    child[i].style.display = 'block';
  }

  startIndex = endIndex;

  if (startIndex >= totalChildren) {
    loaderContainer.style.display = 'none';
  }
}

loadMoreButton?.addEventListener('click', loadMore);
