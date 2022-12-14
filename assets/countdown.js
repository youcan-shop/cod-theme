function initCountdown() {
  const currentDate = new Date();
  let timeRemaining = targetDate - currentDate;

  const countdown = () => {
    try {
      timeRemaining = targetDate - new Date();

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
      const progress = (timeRemaining / (targetDate - currentDate)) * 100;
      const units = { days, hours, minutes, seconds };

      for (const unit in units) {
        const el = document.getElementById(unit);
        if (units[unit] === 0) {
          el.style.display = 'none';
        } else if (el) {
          el.innerHTML = units[unit] + '<span class="unit">' + unit + '</span>';
        }
      }

      const progressEl = document.getElementById('progress');
      progressEl.style.width = progress + '%';

      if (timeRemaining < 0) {
        document.querySelector('.countdown-wrapper').innerHTML = 'Offer Is Expired';
      }
    } catch (error) {}
  };

  countdown();
  setInterval(countdown, 1000);
}

initCountdown();
