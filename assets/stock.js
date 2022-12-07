let progressBarFillWidth = 0

if (typeof stockLeft !== 'number' || typeof totalInStock !== 'number') {
  throw new Error('stockLeft and totalInStock must be numbers')
}

if (stockLeft > 0 && totalInStock > 0) {
  progressBarFillWidth = (stockLeft / totalInStock) * 100
  console.log('stockLeft: ', progressBarFillWidth)
}

document.getElementById('current-stock').innerHTML = stockLeft
document.getElementById('stock-progress').style.width = progressBarFillWidth + '%'
