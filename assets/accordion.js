const accordionHeaders = document.querySelectorAll(".accordion-header");

accordionHeaders.forEach((header) => {
  header.addEventListener("click", () => {
    const accordionContent = header.nextElementSibling;
    const isExpanded = accordionContent.classList.contains("open");

    if (isExpanded) {
      accordionContent.classList.remove("open");
      accordionContent.classList.add("close");
    } else {
      accordionContent.classList.add("open");
      accordionContent.classList.remove("close");
    }
  });
});
