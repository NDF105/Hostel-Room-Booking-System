document.addEventListener("DOMContentLoaded", () => {
    enhanceContactForm();
    initGalleryLightbox();
    handleScrollHeader();
    setCurrentYear();
});

function enhanceContactForm() {
    const form = document.querySelector("#contactForm");
    if (!form) return;

    const feedback = form.querySelector(".form-feedback");
    const successMessage = "Thank you for reaching out. Our team will reply within one business day.";

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const { errors, firstInvalid } = validateForm(form);

        if (errors.length > 0) {
            if (firstInvalid) {
                firstInvalid.focus({ preventScroll: true });
            }
            displayFeedback(feedback, errors.join(" "), "error");
            return;
        }

        displayFeedback(feedback, successMessage, "success");
        form.reset();
    });
}

function validateForm(form) {
    const errors = [];
    let firstInvalid = null;

    const recordError = (condition, message, field) => {
        if (!condition) return;
        errors.push(message);
        if (!firstInvalid) {
            firstInvalid = field;
        }
    };

    const nameField = form.querySelector("#fullName");
    const emailField = form.querySelector("#email");
    const phoneField = form.querySelector("#phone");
    const roomTypeField = form.querySelector("#roomType");
    const messageField = form.querySelector("#message");
    const consentField = form.querySelector("#consent");

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const phone = phoneField.value.trim();
    const roomType = roomTypeField.value;
    const message = messageField.value.trim();
    const consent = consentField.checked;

    const emailPattern = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;
    const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

    recordError(name.length === 0, "Please share your full name.", nameField);
    recordError(name.length > 0 && name.length < 3, "Full name must be at least 3 characters.", nameField);
    recordError(email.length > 0 && !emailPattern.test(email), "Enter a valid email address.", emailField);
    recordError(phone.length > 0 && !phonePattern.test(phone), "Phone number should contain only digits and punctuation.", phoneField);
    recordError(!roomType, "Please select a preferred room type.", roomTypeField);
    recordError(message.length === 0, "Let us know the purpose of your stay.", messageField);
    recordError(message.length > 0 && message.length < 20, "Message should be at least 20 characters.", messageField);
    recordError(!consent, "Consent is required to process your enquiry.", consentField);

    return { errors, firstInvalid };
}

function displayFeedback(element, message, status) {
    if (!element) return;

    element.textContent = message;
    element.classList.remove("success", "error");
    element.classList.add(status);
    element.setAttribute("role", status === "success" ? "status" : "alert");
}

function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll("[data-lightbox]");
    const lightbox = document.querySelector(".lightbox");
    const lightboxImage = lightbox?.querySelector(".lightbox-image");
    const lightboxCaption = lightbox?.querySelector(".lightbox-caption");
    const closeButton = lightbox?.querySelector(".lightbox-close");

    if (!galleryItems.length || !lightbox || !lightboxImage || !closeButton) return;

    const openLightbox = (event, trigger) => {
        event.preventDefault();
        const item = trigger.closest("[data-lightbox]");
        const fullSrc = item.getAttribute("data-full");
        const caption = item.getAttribute("data-caption") || trigger.alt || "";

        lightboxImage.src = fullSrc;
        lightboxImage.alt = caption;
        lightboxCaption.textContent = caption;
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        closeButton.focus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        lightboxImage.src = "";
        lightboxImage.alt = "";
        lightboxCaption.textContent = "";
        document.body.style.overflow = "";
    };

    galleryItems.forEach((item) => {
        const trigger = item.querySelector("img, button, a");
        if (!trigger) return;

        trigger.addEventListener("click", (event) => openLightbox(event, trigger));
        trigger.addEventListener("keypress", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                openLightbox(event, trigger);
            }
        });
    });

    closeButton.addEventListener("click", closeLightbox);
    closeButton.addEventListener("keypress", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            closeLightbox();
        }
    });

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && lightbox.classList.contains("active")) {
            closeLightbox();
        }
    });
}

function handleScrollHeader() {
    const header = document.querySelector("header");
    if (!header) return;

    const toggleScrolledClass = () => {
        if (window.scrollY > 16) {
            header.classList.add("is-scrolled");
        } else {
            header.classList.remove("is-scrolled");
        }
    };

    toggleScrolledClass();
    window.addEventListener("scroll", toggleScrolledClass);
}

function setCurrentYear() {
    const yearElement = document.getElementById("currentYear");
    if (!yearElement) return;
    yearElement.textContent = new Date().getFullYear().toString();
}
