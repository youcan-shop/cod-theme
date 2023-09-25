/* --------------------------- */
/* ----- countdown timer ----- */
/* --------------------------- */

/**
 * addZero function, adds a zero in front of a number if it's less than 10
 * @param {number} x - number to be checked
 * @returns {string} - number with a zero in front if it's less than 10
 */
const addZero = (x) => {
  if (x < 10 && x >= 0) {
    return `0${x}`;
  }

  return x;
}

/**
 * $ function, a shorthand for document.querySelector
 * countdown function, takes a target element and sets the countdown timer
 * @param {*} target
 */
const $ = elem => document.querySelector(elem);

/**
 * countdown function, takes a target element and sets the countdown timer
 * @param {*} target
 */
const countdown = (target) => {
  const tarDate = $(target).getAttribute('data-date').split('-');

  const day = parseInt(tarDate[0]);
  const month = parseInt(tarDate[1]);
  const year = parseInt(tarDate[2]);

  let targetedTime = $(target).getAttribute('data-time');
  let targetedHour, targetedMin;

  if (targetedTime != null) {
    targetedTime = targetedTime.split(':');
    targetedHour = parseInt(targetedTime[0]);
    targetedMin = parseInt(targetedTime[1]);
  }

  // Set the date we're counting down to
  const countDownDate = new Date(year, month-1, day, targetedHour, targetedMin, 0, 0).getTime();
  let countdownInterval;

  const updateTime = () => {
    // Get todays date and time
    const now = new Date().getTime();

    // Find the distance between now an the count down date
    const distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);


    $(`${target} .day .num`).innerHTML = addZero(days);
    $(`${target} .hour .num`).innerHTML = addZero(hours);
    $(`${target} .min .num`).innerHTML = addZero(minutes);
    $(`${target} .sec .num`).innerHTML = addZero(seconds);

    if (distance <= 0) {
      // Stop the countdown by clearing the interval
      clearInterval(countdownInterval);
      $(`${target} .day .num`).innerHTML = '00';
      $(`${target} .hour .num`).innerHTML = '00';
      $(`${target} .min .num`).innerHTML = '00';
      $(`${target} .sec .num`).innerHTML = '00';
      return;
    }
  }

  updateTime();
  countdownInterval = setInterval(updateTime, 1000);
}

/**
 * mountSlider function, mounts a slider based on the screen size
 * @param {MediaQueryList} isMobile - media query list representing mobile screen size
 * @param {Object} mobileSlider - object representing the mobile slider
 * @param {Object} desktopSlider - object representing the desktop slider
 */
function mountSlider(isMobile, mobileSlider, desktopSlider) {
  let isMobileSliderMounted = false;
  let isDesktopSliderMounted = false;

  const runSlider = () => {
    try {
      if (isMobile.matches && !isMobileSliderMounted) {
        window.requestAnimationFrame(() => {
          mobileSlider.mount();
          isMobileSliderMounted = true;
        });

        return;
      }
      if (!isDesktopSliderMounted) {
        window.requestAnimationFrame(() => {
          desktopSlider.mount();
          isDesktopSliderMounted = true;
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  runSlider();
  isMobile.addEventListener('change', runSlider, { passive: true });
}

/**
 * If the value is float fix the decimal in tow digits
 * @param {string | number} value
 * @returns {number} formated value
 */
function isFloat(value) {
  if (isNaN(value)) {
    return 0;
  }

  const numericValue = Number(value);

  if (Number.isInteger(numericValue)) {
    return numericValue.toFixed(0);
  }

  return numericValue.toFixed(2);
}
