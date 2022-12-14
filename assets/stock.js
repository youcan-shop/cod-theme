let progressBarFillWidth = 0;

if (typeof stockLeft !== 'number' || typeof totalInStock !== 'number') {
  throw new Error('stockLeft and totalInStock must be numbers');
}

if (stockLeft > totalInStock) {
  document.querySelector('.stock-wrapper').innerHTML =
    'items left in stock cannot be greater than total items in stock';
} else if (stockLeft > 0 && totalInStock > 0) {
  progressBarFillWidth = (stockLeft / totalInStock) * 100;
}

document.getElementById('current-stock').innerHTML = stockLeft;
document.getElementById('stock-progress').style.width = progressBarFillWidth + '%';
