const progressBarFillWidth = (+stockLeft / +totalInStock) * 100

document.getElementById('current-stock').innerHTML = +stockLeft
document.getElementById('stock-progress').style.width = progressBarFillWidth + '%'
