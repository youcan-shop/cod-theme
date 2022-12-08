function initCountdown() {
  const currentDate = new Date();
  let timeRemaining = targetDate - currentDate;

  const countdown = () => {
    timeRemaining = targetDate - new Date();
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    const progress = (timeRemaining / (targetDate - currentDate) * 100);
    
    document.getElementById('days').innerHTML = days + '<span class="unit">Days</span>';
    document.getElementById('hours').innerHTML = hours + '<span class="unit">Hours</span>';
    document.getElementById('minutes').innerHTML = minutes + '<span class="unit">Minutes</span>';
    document.getElementById('seconds').innerHTML = seconds + '<span class="unit">Seconds</span>';
    document.getElementById('progress').style.width = progress + '%';
  }
  countdown()
  setInterval(countdown, 1000);
}

initCountdown();
