/**
 * Logic for switching contact page content.
 */
(() => {
  /**
   * Check if we're in contact page,
   * if not we exit.
   */
  if(!document.querySelector('.yc-page .yc-page-container .contact-us')) {
    return;
  }

  // Change form fields placeholders.

  /** @type {HTMLInputElement} emailInput */
  const emailInput = document.querySelector('.yc-page .yc-page-container .form-group input#email');
  /** @type {HTMLInputElement} subjectInput */
  const subjectInput = document.querySelector('.yc-page .yc-page-container .form-group input#subject');
  /** @type {HTMLTextareaElement} messageInput */
  const messageInput = document.querySelector('.yc-page .yc-page-container .form-group textarea#message');

  emailInput.placeholder = CONTACT_FORM_PLACEHOLDERS[emailInput.id];
  subjectInput.placeholder = CONTACT_FORM_PLACEHOLDERS[subjectInput.id];
  messageInput.placeholder = CONTACT_FORM_PLACEHOLDERS[messageInput.id];

  // Change Button text.

  /** @type {HTMLButtonElement} formButton */
  const formButton = document.querySelector('.yc-page .yc-page-container .form-group button[type="submit"]');
  formButton.innerText = CONTACT_PAGE_CONTENT.button;

  // Add title and subtitle

  const title = document.createElement('h1');
  const subtitle = document.createElement('h2');

  title.classList.add('contact_title');
  subtitle.classList.add('contact_subtitle');

  title.innerText = CONTACT_PAGE_CONTENT.title;
  subtitle.innerText = CONTACT_PAGE_CONTENT.subtitle;

  const contactForm = document.querySelector('.yc-page .yc-page-container .contact-us .contact-form');

  contactForm.insertBefore(subtitle, contactForm.firstChild);
  contactForm.insertBefore(title, contactForm.firstChild);
})();
