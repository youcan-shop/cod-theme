function accordionClickHandler() {
  this.classList.toggle("active");
  const accordionContent = this.nextElementSibling;

  if (accordionContent.style.maxHeight) {
    /**
    * If the accordion is currently open, then close it
    */
    accordionContent.style.maxHeight = null;
  } else {
    /**
    * If the accordion is currently closed, then open it
    */
    accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
  }
}

function setupAccordion() {
  const accordionHeaders = document.querySelectorAll(".accordion-header");

  accordionHeaders.forEach((accordion) => {
    // remove the event listener before adding it to prevent duplicates
    accordion.removeEventListener("click", accordionClickHandler);
    accordion.addEventListener("click", accordionClickHandler);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setupAccordion();
});
