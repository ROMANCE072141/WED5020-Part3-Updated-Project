/* YEAST Artisan Bakery & Grocer — Part 3 JavaScript
   Features: responsive navigation, enquiry validation, mailto contact form,
   product search/filter, image lightbox, accordion and back-to-top control. */
document.addEventListener("DOMContentLoaded", () => {
    // Highlight the current page in the navigation.
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("#primary-nav a").forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            link.setAttribute("aria-current", "page");
        }
    });

    // Mobile navigation menu.
    const navToggle = document.querySelector(".nav-toggle");
    const primaryNav = document.getElementById("primary-nav");
    if (navToggle && primaryNav) {
        navToggle.addEventListener("click", () => {
            const isOpen = primaryNav.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
            navToggle.textContent = isOpen ? "Close menu" : "Menu";
        });
    }

    // Accessible accordion: only the selected panel opens.
    document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
        trigger.addEventListener("click", () => {
            const panel = trigger.closest(".accordion-item").querySelector(".accordion-panel");
            const shouldOpen = trigger.getAttribute("aria-expanded") !== "true";
            document.querySelectorAll(".accordion-trigger").forEach((other) => {
                other.setAttribute("aria-expanded", "false");
                const otherPanel = other.closest(".accordion-item").querySelector(".accordion-panel");
                otherPanel.hidden = true;
                const icon = other.querySelector("span");
                if (icon) icon.textContent = "+";
            });
            trigger.setAttribute("aria-expanded", String(shouldOpen));
            panel.hidden = !shouldOpen;
            const icon = trigger.querySelector("span");
            if (icon) icon.textContent = shouldOpen ? "−" : "+";
        });
    });

    // Product search and category filter.
    const searchInput = document.getElementById("product-search");
    const categoryFilter = document.getElementById("category-filter");
    const productCards = Array.from(document.querySelectorAll(".product-card"));
    const productCount = document.getElementById("product-count");
    const noProducts = document.getElementById("no-products");
    const filterProducts = () => {
        if (!searchInput || !categoryFilter || productCards.length === 0) return;
        const query = searchInput.value.trim().toLowerCase();
        const category = categoryFilter.value;
        let visibleCount = 0;
        productCards.forEach((card) => {
            const matchesText = (card.dataset.search + " " + card.textContent).toLowerCase().includes(query);
            const matchesCategory = category === "all" || card.dataset.category === category;
            const visible = matchesText && matchesCategory;
            card.hidden = !visible;
            if (visible) visibleCount += 1;
        });
        if (productCount) productCount.textContent = `Showing ${visibleCount} of ${productCards.length} product categories.`;
        if (noProducts) noProducts.hidden = visibleCount !== 0;
    };
    if (searchInput) searchInput.addEventListener("input", filterProducts);
    if (categoryFilter) categoryFilter.addEventListener("change", filterProducts);

    // Product gallery lightbox.
    const lightbox = document.getElementById("image-lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCaption = document.getElementById("lightbox-caption");
    document.querySelectorAll(".lightbox-trigger").forEach((button) => {
        button.addEventListener("click", () => {
            if (!lightbox || !lightboxImage) return;
            lightboxImage.src = button.dataset.image;
            lightboxImage.alt = button.dataset.alt || "";
            if (lightboxCaption) lightboxCaption.textContent = button.dataset.alt || "";
            if (typeof lightbox.showModal === "function") lightbox.showModal();
            else window.open(button.dataset.image, "_blank", "noopener");
        });
    });
    if (lightbox) {
        const closeButton = lightbox.querySelector(".lightbox-close");
        if (closeButton) closeButton.addEventListener("click", () => lightbox.close());
        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) lightbox.close();
        });
    }

    // Enquiry form: browser-side validation and a clear demonstration response.
    const enquiryForm = document.getElementById("enquiryForm");
    const enquiryMessage = document.getElementById("formMessage");
    if (enquiryForm && enquiryMessage) {
        const params = new URLSearchParams(window.location.search);
        const requestedType = params.get("type");
        const typeSelect = document.getElementById("enquiry-type");
        if (requestedType && typeSelect) {
            Array.from(typeSelect.options).forEach((option) => {
                if (option.text.toLowerCase() === requestedType.toLowerCase()) typeSelect.value = option.value;
            });
        }
        enquiryForm.addEventListener("submit", (event) => {
            event.preventDefault();
            enquiryMessage.className = "form-message";
            if (!enquiryForm.checkValidity()) {
                enquiryMessage.textContent = "Please check the highlighted fields and provide valid information.";
                enquiryMessage.classList.add("error");
                enquiryForm.reportValidity();
                return;
            }
            const name = document.getElementById("enquiry-name").value.trim();
            const type = document.getElementById("enquiry-type").value;
            const product = document.getElementById("enquiry-product").value.trim();
            enquiryMessage.textContent = `Thank you, ${name}. Your ${type.toLowerCase()}${product ? ` about ${product}` : ""} has passed validation. This demonstration has not sent the enquiry to a server.`;
            enquiryMessage.classList.add("success");
            enquiryForm.reset();
        });
    }

    // Contact form: validate fields, then prepare an email in the user's mail app.
    // IMPORTANT: replace this example address with the approved recipient before submission.
    const CONTACT_RECIPIENT = "hello@example.com";
    const contactForm = document.getElementById("contactForm");
    const contactMessage = document.getElementById("contactMessage");
    if (contactForm && contactMessage) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            contactMessage.className = "form-message";
            if (!contactForm.checkValidity()) {
                contactMessage.textContent = "Please check the highlighted fields and provide valid information.";
                contactMessage.classList.add("error");
                contactForm.reportValidity();
                return;
            }
            if (CONTACT_RECIPIENT === "hello@example.com") {
                contactMessage.textContent = "The form is valid, but hello@example.com is a placeholder. Update CONTACT_RECIPIENT in js/script.js to the approved email address before using this feature.";
                contactMessage.classList.add("error");
                return;
            }
            const name = document.getElementById("contact-name").value.trim();
            const email = document.getElementById("contact-email").value.trim();
            const type = document.getElementById("contact-type").value;
            const message = document.getElementById("contact-message").value.trim();
            const subject = encodeURIComponent(`YEAST website: ${type}`);
            const body = encodeURIComponent(`Name: ${name}\nReply email: ${email}\nMessage type: ${type}\n\nMessage:\n${message}`);
            contactMessage.textContent = "Your email application should open with a prepared message. Review it and press Send in that application.";
            contactMessage.classList.add("success");
            window.location.href = `mailto:${CONTACT_RECIPIENT}?subject=${subject}&body=${body}`;
        });
    }

    // Back-to-top button.
    const backToTop = document.getElementById("back-to-top");
    if (backToTop) {
        const updateBackToTop = () => backToTop.classList.toggle("visible", window.scrollY > 350);
        window.addEventListener("scroll", updateBackToTop, { passive: true });
        updateBackToTop();
        backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }
});
