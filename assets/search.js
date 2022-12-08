const paginateBtnPrev = document.querySelector('.paginate-btn-prev')
const paginateBtnNext = document.querySelector('.paginate-btn-next')
const paginateBtnCurrent = document.querySelectorAll('.paginate-btn')

const urlParams = new URLSearchParams(window.location.search)
const query = urlParams.get('q')
let page = +urlParams.get('page[some_unique_id]')

if (page <= 1 || !page) {
  page = 1

  if (paginateBtnPrev) {
    paginateBtnPrev.setAttribute('disabled', true)
  }
}

if (paginateBtnPrev) {
  paginateBtnPrev.setAttribute('href', `/search?q=${query}&page[some_unique_id]=${page - 1}`)
}

if (paginateBtnNext) {
  paginateBtnNext.setAttribute('href', `/search?q=${query}&page[some_unique_id]=${page + 1}`)
}

if (paginateBtnCurrent) {
  paginateBtnCurrent.forEach((btn) => {
    btn.setAttribute('href', `/search?q=${query}&page[some_unique_id]=${btn.dataset.index}`)
  })
}
