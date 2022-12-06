const x = setInterval(() => {
  let countDownDate = +localStorage.getItem('countDownDate')

  if (!countDownDate || countDownDate < new Date().getTime()) {
    countDownDate = new Date().getTime() + 9 * 60 * 60 * 1000
    localStorage.setItem('countDownDate', countDownDate)
  }

  const now = new Date().getTime()
  const distance = countDownDate - now
  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  // Display the result in the element with id="demo"
  document.getElementById('days').innerHTML = days + '<div class="unit-title">DAYS</div>'
  document.getElementById('hours').innerHTML = hours + '<div class="unit-title">HOURS</div>'
  document.getElementById('minutes').innerHTML = minutes + '<div class="unit-title">MINUTES</div>'
  document.getElementById('seconds').innerHTML = seconds + '<div class="unit-title">SECONDS</div>'

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x)
    document.getElementById('demo').innerHTML = 'EXPIRED'
  }
}, 1000)
