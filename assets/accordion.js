const accordionHeaders = document.querySelectorAll(".accordion-header");

accordionHeaders.forEach((accordion) => {
  accordion.onclick = function () {
    this.classList.toggle("active");

    let accordionContent = this.nextElementSibling;

    if (accordionContent.style.maxHeight) {
      //this is if the accordion is open
      accordionContent.style.maxHeight = null;
    } else {
      //if the accordion is currently closed
      accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
    }
  };
});
