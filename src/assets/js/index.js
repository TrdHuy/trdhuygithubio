'use strict';
const TRD_CONTRACT = window.TRD_CONTRACT;
window.top.showTopWindowInputForm = function showTopWindowInputForm(url, submitCallback) {
  this.window.loadFormToIFrame(url, formIframe);
  formIframe.submitCallback = submitCallback;
  formIframe.currentUrl = url;
  toogleFormInput(true);
}
window.top.hideTopWindowInputForm = function hideTopWindowInputForm(url) {
  if (formIframe.currentUrl === url) {
    toogleFormInput(false);
  }
}
const toogleFormInput = function (isShow) {
  if (isShow === true) {
    formInputContainer.classList.add("active");
    formInputOverlay.classList.add("active");
  } else {
    formInputContainer.classList.remove("active");
    formInputOverlay.classList.remove("active");
    formIframe.submitCallback = undefined;
    formIframe.currentUrl = undefined;
  }
}

window.addEventListener('load', function () {
  TRD_CONTRACT.clearLocalStorage();
});


// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



//######################################################################

// form input variables
window.addEventListener('message', function (event) {
  const data = event.data;
  switch (data.event) {
    default:
      console.log('Unknown event:', data.event);
  }
});

const formInputContainer = document.querySelector("[form-input-container]");
const formInputCloseBtn = document.querySelector("[form-input-close-btn]");
const formInputOverlay = document.querySelector("[form-input-overlay]");
const formInputModalContent = document.querySelector("[form-input-modal-content]");
const formIframe = document.getElementById("formInputFrame");

formInputCloseBtn.addEventListener("click", () => toogleFormInput(false));
formInputOverlay.addEventListener("click", () => toogleFormInput(false));

//#########################SERVICE-DETAIL###############################

// service detail variables
const serviceItem = document.querySelectorAll("[data-service-item]");
const serviceModalContainer = document.querySelector("[data-service-modal-container]");
const serviceModalCloseBtn = document.querySelector("[data-service-modal-close-btn]");
const serviceOverlay = document.querySelector("[data-service-overlay]");

// modal variable
const serviceModalImg = document.querySelector("[data-service-modal-img]");
const serviceModalTitle = document.querySelector("[data-service-modal-title]");
const serviceModalText = document.querySelector("[data-service-modal-text]");

// modal toggle function
const serviceModalFunc = function () {
  serviceModalContainer.classList.toggle("active");
  serviceOverlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < serviceItem.length; i++) {

  serviceItem[i].addEventListener("click", function () {

    serviceModalImg.src = this.querySelector("[data-service-avatar]").src;
    serviceModalImg.alt = this.querySelector("[data-service-avatar]").alt;
    serviceModalTitle.innerHTML = this.querySelector("[data-service-title]").innerHTML;
    serviceModalText.innerHTML = this.querySelector("[data-service-text]").innerHTML;

    serviceModalFunc();

  });

}

// add click event to modal close button
serviceModalCloseBtn.addEventListener("click", serviceModalFunc);
serviceOverlay.addEventListener("click", serviceModalFunc);

//######################################################################


// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);

        const iframe = pages[i].querySelector('iframe');
        if (iframe) {
          iframe.src = pages[i].dataset.src;
        } else {
        }
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

