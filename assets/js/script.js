'use strict';


/**
 * Portfolio interactions — Anas Alhalabi
 * Based on the vCard template by codewithsadee (MIT), trimmed to the
 * sections this site uses: sidebar toggle, project filter, form, page nav.
 */


// generic "active" toggle
const elementToggleFunc = (elem) => elem.classList.toggle('active');


/**
 * sidebar toggle (mobile)
 */
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');

if (sidebarBtn) {
  sidebarBtn.addEventListener('click', () => elementToggleFunc(sidebar));
}


/**
 * custom select + project filtering
 */
const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-selecct-value]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');
const filterItems = document.querySelectorAll('[data-filter-item]');

if (select) {
  select.addEventListener('click', function () { elementToggleFunc(this); });
}

const filterFunc = (selectedValue) => {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === 'all' || selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add('active');
    } else {
      filterItems[i].classList.remove('active');
    }
  }
};

for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener('click', function () {
    const selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// large-screen filter buttons
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener('click', function () {
    const selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove('active');
    this.classList.add('active');
    lastClickedBtn = this;
  });
}


/**
 * contact form validation + mailto fallback
 *
 * The submit button stays disabled until the form is valid. If the form's
 * action still holds the Formspree placeholder, we fall back to a mailto:
 * link so the site works before Formspree is configured.
 */
const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');
const CONTACT_EMAIL = 'anas.alhalabi.official@gmail.com';

if (form) {
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener('input', () => {
      if (form.checkValidity()) {
        formBtn.removeAttribute('disabled');
      } else {
        formBtn.setAttribute('disabled', '');
      }
    });
  }

  const formNotConfigured = form.getAttribute('action').includes('{your-form-id}');

  if (formNotConfigured) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    });
  }
}


/**
 * page navigation (tabbed sections)
 */
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener('click', function () {
    const target = this.innerHTML.toLowerCase();

    for (let j = 0; j < pages.length; j++) {
      const isMatch = target === pages[j].dataset.page;
      pages[j].classList.toggle('active', isMatch);
    }

    for (let k = 0; k < navigationLinks.length; k++) {
      navigationLinks[k].classList.toggle('active', navigationLinks[k] === this);
    }

    window.scrollTo(0, 0);
  });
}
