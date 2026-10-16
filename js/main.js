
/* =========================================================
   SKYLIGHT INSTALLATION COMPANY
   PART 4: MAIN JAVASCRIPT
   File: js/main.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       01. ELEMENTS
    ===================================================== */

    const html = document.documentElement;
    const body = document.body;

    const header = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mainNavigation = document.getElementById("mainNavigation");

    const rtlToggle = document.getElementById("rtlToggle");
    const darkModeToggle = document.getElementById("darkModeToggle");

    const homeDropdown = document.querySelector(
        ".site-header .has-dropdown"
    );

    const dropdownToggle = homeDropdown
        ? homeDropdown.querySelector(".dropdown-toggle")
        : null;

    const dropdownMenu = document.getElementById("homeDropdown");

    const mobileBreakpoint = 1199;


    /* =====================================================
       02. INITIAL THEME
    ===================================================== */

    function applyDarkMode(enabled) {

        body.classList.toggle("dark-mode", enabled);

        if (darkModeToggle) {

            const icon = darkModeToggle.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-moon", !enabled);
                icon.classList.toggle("fa-sun", enabled);
            }

            darkModeToggle.setAttribute(
                "aria-pressed",
                String(enabled)
            );

            darkModeToggle.setAttribute(
                "aria-label",
                enabled ? "Enable light mode" : "Enable dark mode"
            );

            darkModeToggle.setAttribute(
                "title",
                enabled ? "Switch to light mode" : "Switch to dark mode"
            );
        }
    }

    let savedDarkMode = false;

    try {
        savedDarkMode =
            localStorage.getItem("skylight-dark-mode") === "true";
    } catch (error) {
        savedDarkMode = false;
    }

    applyDarkMode(savedDarkMode);

    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", () => {

            const enabled = !body.classList.contains("dark-mode");

            applyDarkMode(enabled);

            try {
                localStorage.setItem(
                    "skylight-dark-mode",
                    String(enabled)
                );
            } catch (error) {
                // Theme still works for the current page.
            }
        });
    }


    /* =====================================================
       03. RTL TOGGLE
    ===================================================== */

    function applyRTL(enabled) {

        html.setAttribute("dir", enabled ? "rtl" : "ltr");

        body.classList.toggle("rtl-mode", enabled);

        if (rtlToggle) {

            rtlToggle.setAttribute(
                "aria-pressed",
                String(enabled)
            );

            rtlToggle.setAttribute(
                "aria-label",
                enabled
                    ? "Switch to left-to-right layout"
                    : "Switch to right-to-left layout"
            );

            rtlToggle.setAttribute(
                "title",
                enabled ? "Switch to LTR" : "Switch to RTL"
            );
        }
    }

    let savedRTL = false;

    try {
        savedRTL = localStorage.getItem("skylight-rtl") === "true";
    } catch (error) {
        savedRTL = false;
    }

    applyRTL(savedRTL);

    if (rtlToggle) {
        rtlToggle.addEventListener("click", () => {

            const enabled = html.getAttribute("dir") !== "rtl";

            applyRTL(enabled);

            try {
                localStorage.setItem(
                    "skylight-rtl",
                    String(enabled)
                );
            } catch (error) {
                // RTL still works for the current page.
            }
        });
    }


    /* =====================================================
       04. HAMBURGER MENU
    ===================================================== */

    function isResponsiveView() {
        return window.innerWidth <= mobileBreakpoint;
    }

    function setMenuOpen(open) {

        if (!mainNavigation || !menuToggle) {
            return;
        }

        mainNavigation.classList.toggle("active", open);

        menuToggle.classList.toggle("active", open);

        menuToggle.setAttribute(
            "aria-expanded",
            String(open)
        );

        menuToggle.setAttribute(
            "aria-label",
            open ? "Close navigation menu" : "Open navigation menu"
        );

        if (open) {
            body.classList.add("menu-open");
        } else {
            body.classList.remove("menu-open");
        }
    }

    if (menuToggle && mainNavigation) {

        menuToggle.addEventListener("click", (event) => {

            event.stopPropagation();

            const isOpen =
                mainNavigation.classList.contains("active");

            setMenuOpen(!isOpen);
        });

        /* Close menu when clicking outside */

        document.addEventListener("click", (event) => {

            if (!isResponsiveView()) {
                return;
            }

            if (
                !header ||
                !header.contains(event.target)
            ) {
                setMenuOpen(false);
                closeHomeDropdown();
            }
        });

        /* Close menu with Escape */

        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                setMenuOpen(false);
                closeHomeDropdown();

                if (menuToggle) {
                    menuToggle.focus();
                }
            }
        });

        /* Close after selecting a navigation link */

        mainNavigation.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", () => {

                if (isResponsiveView()) {
                    setMenuOpen(false);
                    closeHomeDropdown();
                }
            });
        });
    }


    /* =====================================================
       05. HOME DROPDOWN
    ===================================================== */

    function closeHomeDropdown() {

        if (!homeDropdown || !dropdownToggle) {
            return;
        }

        homeDropdown.classList.remove("is-open");

        dropdownToggle.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    function toggleHomeDropdown() {

        if (!homeDropdown || !dropdownToggle) {
            return;
        }

        const open = homeDropdown.classList.toggle("is-open");

        dropdownToggle.setAttribute(
            "aria-expanded",
            String(open)
        );
    }

    if (dropdownToggle && homeDropdown) {

        dropdownToggle.addEventListener("click", (event) => {

            event.preventDefault();
            event.stopPropagation();

            toggleHomeDropdown();
        });

        /* Close when clicking elsewhere */

        document.addEventListener("click", (event) => {

            if (!homeDropdown.contains(event.target)) {
                closeHomeDropdown();
            }
        });

        /* Keep dropdown usable by keyboard */

        dropdownToggle.addEventListener("keydown", (event) => {

            if (
                event.key === "ArrowDown" ||
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();

                if (!homeDropdown.classList.contains("is-open")) {
                    toggleHomeDropdown();
                }

                const firstLink = dropdownMenu
                    ? dropdownMenu.querySelector("a")
                    : null;

                if (firstLink) {
                    firstLink.focus();
                }
            }
        });

        if (dropdownMenu) {

            dropdownMenu.addEventListener("keydown", (event) => {

                if (event.key === "Escape") {

                    closeHomeDropdown();
                    dropdownToggle.focus();
                }
            });
        }
    }


    /* =====================================================
       06. RESPONSIVE RESIZE
    ===================================================== */

    let previousResponsiveState = isResponsiveView();

    window.addEventListener("resize", () => {

        const currentResponsiveState = isResponsiveView();

        if (currentResponsiveState !== previousResponsiveState) {

            setMenuOpen(false);
            closeHomeDropdown();

            previousResponsiveState = currentResponsiveState;
        }
    });


    /* =====================================================
       07. FIXED HEADER SCROLL SHADOW
    ===================================================== */

    function updateHeaderScroll() {

        if (!header) {
            return;
        }

        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener(
        "scroll",
        updateHeaderScroll,
        { passive: true }
    );

    updateHeaderScroll();


    /* =====================================================
       08. INITIAL ARIA STATES
    ===================================================== */

    if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
    }

    if (dropdownToggle) {
        dropdownToggle.setAttribute("aria-expanded", "false");
    }

});








/******HOME-1********/

/* =========================================================
   HOME 1 - AUTOMATIC TWO-SLIDE HERO
   No Previous / Next buttons
========================================================= */

(() => {
    const hero = document.getElementById("home1Hero");

    if (!hero) return;

    const slides = [...hero.querySelectorAll(".home1-hero-slide")];
    const dots = [...hero.querySelectorAll(".home1-hero-dot")];

    if (slides.length !== 2 || dots.length !== 2) return;

    let activeIndex = 0;
    let intervalId;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function showSlide(index) {
        activeIndex = index;

        slides.forEach((slide, i) => {
            const active = i === activeIndex;

            slide.classList.toggle("active", active);
            slide.setAttribute("aria-hidden", String(!active));
        });

        dots.forEach((dot, i) => {
            const active = i === activeIndex;

            dot.classList.toggle("active", active);

            if (active) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });
    }

    function startAutoplay() {
        if (reducedMotion || intervalId) return;

        intervalId = window.setInterval(() => {
            showSlide((activeIndex + 1) % slides.length);
        }, 5000);
    }

    function stopAutoplay() {
        window.clearInterval(intervalId);
        intervalId = undefined;
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);

            stopAutoplay();
            startAutoplay();
        });
    });

    hero.addEventListener("mouseenter", stopAutoplay);
    hero.addEventListener("mouseleave", startAutoplay);

    hero.addEventListener("focusin", stopAutoplay);
    hero.addEventListener("focusout", startAutoplay);

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    showSlide(0);
    startAutoplay();
})();






/* =====================================================
   HOME 1 - TESTIMONIALS SLIDER
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".home1-testimonials-slider");

    if (!slider) return;

    const testimonials = Array.from(
        slider.querySelectorAll(".home1-testimonial")
    );

    const previousButton = document.querySelector(
        ".home1-testimonial-prev"
    );

    const nextButton = document.querySelector(
        ".home1-testimonial-next"
    );

    if (!testimonials.length || !previousButton || !nextButton) {
        return;
    }

    let currentIndex = testimonials.findIndex(function (testimonial) {
        return testimonial.classList.contains("active");
    });

    if (currentIndex < 0) currentIndex = 0;

    function showTestimonial(index) {
        currentIndex =
            (index + testimonials.length) % testimonials.length;

        testimonials.forEach(function (testimonial, i) {
            const isActive = i === currentIndex;

            testimonial.classList.toggle("active", isActive);
            testimonial.setAttribute(
                "aria-hidden",
                String(!isActive)
            );
        });
    }

    previousButton.addEventListener("click", function () {
        showTestimonial(currentIndex - 1);
    });

    nextButton.addEventListener("click", function () {
        showTestimonial(currentIndex + 1);
    });

    /* INITIALIZE SLIDER */
    showTestimonial(currentIndex);
});







/* =====================================================
   HOME 1 - FAQ ACCORDION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    const faqSection = document.querySelector("#home1Faq");

    if (!faqSection) return;

    const faqItems = faqSection.querySelectorAll(".home1-faq-item");

    faqItems.forEach(function (item) {
        const button = item.querySelector(".home1-faq-question");
        const answer = item.querySelector(".home1-faq-answer");
        const icon = item.querySelector(".home1-faq-icon i");

        if (!button || !answer || !icon) return;

        function setFaqState(isOpen) {
            item.classList.toggle("active", isOpen);

            button.setAttribute("aria-expanded", String(isOpen));

            answer.hidden = !isOpen;

            icon.classList.toggle("fa-plus", !isOpen);
            icon.classList.toggle("fa-minus", isOpen);
        }

        // Match the initial HTML state.
        setFaqState(
            button.getAttribute("aria-expanded") === "true"
        );

        button.addEventListener("click", function () {
            const isCurrentlyOpen =
                button.getAttribute("aria-expanded") === "true";

            // Close other FAQ items.
            faqItems.forEach(function (otherItem) {
                const otherButton = otherItem.querySelector(
                    ".home1-faq-question"
                );

                const otherAnswer = otherItem.querySelector(
                    ".home1-faq-answer"
                );

                const otherIcon = otherItem.querySelector(
                    ".home1-faq-icon i"
                );

                if (!otherButton || !otherAnswer || !otherIcon) return;

                otherItem.classList.remove("active");
                otherButton.setAttribute("aria-expanded", "false");
                otherAnswer.hidden = true;

                otherIcon.classList.remove("fa-minus");
                otherIcon.classList.add("fa-plus");
            });

            // Toggle the selected item.
            if (!isCurrentlyOpen) {
                setFaqState(true);
            }
        });
    });
});















/********LOGIN*******/


/* =========================================================
   LOGIN PAGE — JAVASCRIPT
   File: js/login.js
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       1. PASSWORD SHOW / HIDE
    ===================================================== */

    const passwordInput = document.getElementById("loginPassword");
    const passwordToggle = document.getElementById("loginPasswordToggle");

    if (passwordInput && passwordToggle) {
        passwordToggle.addEventListener("click", function () {

            const isPassword = passwordInput.type === "password";

            passwordInput.type = isPassword ? "text" : "password";

            passwordToggle.innerHTML = isPassword
                ? '<i class="fa-solid fa-eye-slash" aria-hidden="true"></i>'
                : '<i class="fa-solid fa-eye" aria-hidden="true"></i>';

            passwordToggle.setAttribute(
                "aria-label",
                isPassword ? "Hide password" : "Show password"
            );

            passwordToggle.setAttribute(
                "aria-pressed",
                String(isPassword)
            );
        });
    }


    /* =====================================================
       2. DARK MODE TOGGLE
    ===================================================== */

    const themeToggle = document.getElementById("loginThemeToggle");
    const themeIcon = themeToggle
        ? themeToggle.querySelector("i")
        : null;

    function updateThemeIcon() {
        if (!themeIcon) return;

        const isDark = document.body.classList.contains("dark-mode");

        themeIcon.className = isDark
            ? "fa-solid fa-sun"
            : "fa-solid fa-moon";

        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );

        themeToggle.setAttribute(
            "aria-pressed",
            String(isDark)
        );
    }

    if (themeToggle) {
        updateThemeIcon();

        themeToggle.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
            updateThemeIcon();
        });
    }


    /* =====================================================
       3. RTL / LTR TOGGLE
    ===================================================== */

    const rtlToggle = document.getElementById("loginRtlToggle");

    if (rtlToggle) {

        function updateDirection() {
            const isRTL = document.documentElement.dir === "rtl";

            document.body.classList.toggle("rtl-mode", isRTL);

            rtlToggle.setAttribute(
                "aria-label",
                isRTL ? "Switch to left-to-right layout" : "Switch to right-to-left layout"
            );

            rtlToggle.setAttribute(
                "aria-pressed",
                String(isRTL)
            );
        }

        updateDirection();

        rtlToggle.addEventListener("click", function () {

            const currentDirection = document.documentElement.dir || "ltr";

            document.documentElement.dir =
                currentDirection === "rtl" ? "ltr" : "rtl";

            updateDirection();
        });
    }


    /* =====================================================
       4. LOGIN FORM VALIDATION
    ===================================================== */

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            if (!loginForm.checkValidity()) {
                loginForm.reportValidity();
                return;
            }

            const emailInput = document.getElementById("loginEmail");
            const passwordField = document.getElementById("loginPassword");

            if (!emailInput || !passwordField) return;

            const email = emailInput.value.trim();
            const password = passwordField.value;

            if (!email || !password) {
                alert("Please enter your email and password.");
                return;
            }

            /*
             * DEMO ONLY:
             * Replace this alert with a request to your
             * backend authentication endpoint.
             *
             * Never store passwords in localStorage or
             * sessionStorage.
             */

            alert(
                "Form validation successful. Connect your backend authentication to sign in."
            );
        });
    }


    /* =====================================================
       5. SOCIAL LOGIN BUTTONS
    ===================================================== */

    const socialButtons = document.querySelectorAll(
        ".login-social-button"
    );

    socialButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const provider = button.dataset.provider;

            if (!provider) return;

            const providerNames = {
                google: "Google",
                facebook: "Facebook",
                apple: "Apple"
            };

            const providerName =
                providerNames[provider.toLowerCase()] || provider;

            /*
             * DEMO ONLY:
             * Replace this alert with the appropriate OAuth
             * authentication flow configured on your backend.
             */

            alert(
                providerName +
                " sign-in requires authentication integration."
            );
        });
    });

});












/********REGISTER PAGE******/

/* =========================================================
   REGISTER PAGE — JAVASCRIPT
   File: js/register.js
   Theme: Charcoal + Sky Blue
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       1. PASSWORD SHOW / HIDE
    ===================================================== */

    const passwordToggles = document.querySelectorAll(
        ".register-password-toggle"
    );

    passwordToggles.forEach(function (toggle) {

        toggle.addEventListener("click", function () {

            const targetId = toggle.dataset.passwordTarget;
            const passwordInput = document.getElementById(targetId);

            if (!passwordInput) return;

            const showPassword = passwordInput.type === "password";

            passwordInput.type = showPassword ? "text" : "password";

            const icon = toggle.querySelector("i");

            if (icon) {
                icon.className = showPassword
                    ? "fa-regular fa-eye-slash"
                    : "fa-regular fa-eye";
            }

            toggle.setAttribute(
                "aria-label",
                showPassword ? "Hide password" : "Show password"
            );

            toggle.setAttribute(
                "aria-pressed",
                String(showPassword)
            );
        });

    });


    /* =====================================================
       2. DARK MODE TOGGLE
    ===================================================== */

    const themeToggle = document.getElementById("registerThemeToggle");
    const themeIcon = themeToggle
        ? themeToggle.querySelector("i")
        : null;

    function updateThemeIcon() {

        if (!themeToggle || !themeIcon) return;

        const isDark = document.body.classList.contains("dark-mode");

        themeIcon.className = isDark
            ? "fa-solid fa-sun"
            : "fa-solid fa-moon";

        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );

        themeToggle.setAttribute(
            "aria-pressed",
            String(isDark)
        );
    }

    if (themeToggle) {

        updateThemeIcon();

        themeToggle.addEventListener("click", function () {

            document.body.classList.toggle("dark-mode");

            updateThemeIcon();

        });
    }


    /* =====================================================
       3. RTL / LTR TOGGLE
    ===================================================== */

    const rtlToggle = document.getElementById("registerRtlToggle");

    function updateDirection() {

        if (!rtlToggle) return;

        const isRTL = document.documentElement.dir === "rtl";

        document.body.classList.toggle("rtl-mode", isRTL);

        rtlToggle.setAttribute(
            "aria-label",
            isRTL
                ? "Switch to left-to-right layout"
                : "Switch to right-to-left layout"
        );

        rtlToggle.setAttribute(
            "aria-pressed",
            String(isRTL)
        );
    }

    if (rtlToggle) {

        updateDirection();

        rtlToggle.addEventListener("click", function () {

            const currentDirection =
                document.documentElement.dir || "ltr";

            document.documentElement.dir =
                currentDirection === "rtl" ? "ltr" : "rtl";

            updateDirection();

        });
    }


    /* =====================================================
       4. REGISTER FORM VALIDATION
    ===================================================== */

    const registerForm = document.getElementById("registerForm");

    const nameInput = document.getElementById("registerName");
    const emailInput = document.getElementById("registerEmail");
    const passwordInput = document.getElementById("registerPassword");
    const confirmPasswordInput = document.getElementById(
        "registerConfirmPassword"
    );
    const termsCheckbox = document.getElementById("registerTerms");

    if (registerForm) {

        registerForm.addEventListener("submit", function (event) {

            event.preventDefault();

            /* Browser validation */

            if (!registerForm.checkValidity()) {
                registerForm.reportValidity();
                return;
            }

            /* Full name */

            if (!nameInput.value.trim()) {
                nameInput.setCustomValidity(
                    "Please enter your full name."
                );

                nameInput.reportValidity();
                nameInput.setCustomValidity("");
                nameInput.focus();

                return;
            }

            /* Email */

            if (!emailInput.value.trim()) {
                emailInput.focus();
                return;
            }

            /* Password length */

            if (passwordInput.value.length < 8) {

                passwordInput.setCustomValidity(
                    "Your password must contain at least 8 characters."
                );

                passwordInput.reportValidity();
                passwordInput.setCustomValidity("");
                passwordInput.focus();

                return;
            }

            /* Confirm password */

            if (
                passwordInput.value !==
                confirmPasswordInput.value
            ) {

                confirmPasswordInput.setCustomValidity(
                    "Passwords do not match. Please try again."
                );

                confirmPasswordInput.reportValidity();
                confirmPasswordInput.setCustomValidity("");
                confirmPasswordInput.focus();

                return;
            }

            /* Terms acceptance */

            if (!termsCheckbox.checked) {

                termsCheckbox.setCustomValidity(
                    "Please accept the Terms & Conditions and Privacy Policy."
                );

                termsCheckbox.reportValidity();
                termsCheckbox.setCustomValidity("");
                termsCheckbox.focus();

                return;
            }

            /*
             * FRONT-END DEMO ONLY
             *
             * Connect your backend registration endpoint here.
             * Do not store passwords in localStorage or
             * sessionStorage.
             */

            alert(
                "Your form is valid! Connect your backend to create your account."
            );

        });


        /* Clear password mismatch when the user edits either field */

        [passwordInput, confirmPasswordInput].forEach(function (input) {

            if (!input) return;

            input.addEventListener("input", function () {

                confirmPasswordInput.setCustomValidity("");

            });

        });

        /* Clear custom validation messages for terms */

        if (termsCheckbox) {

            termsCheckbox.addEventListener("change", function () {

                termsCheckbox.setCustomValidity("");

            });

        }

    }


    /* =====================================================
       5. SOCIAL SIGN-UP BUTTONS
    ===================================================== */

    const socialButtons = document.querySelectorAll(
        ".register-social-button"
    );

    socialButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const provider = button.dataset.provider;

            const providerNames = {
                google: "Google",
                facebook: "Facebook",
                apple: "Apple"
            };

            const providerName = providerNames[provider];

            if (!providerName) return;

            /*
             * DEMO ONLY
             *
             * Replace this alert with the provider's
             * configured OAuth sign-up flow.
             */

            alert(
                providerName +
                " sign-up requires authentication integration."
            );

        });

    });

});

























/* =========================================================
   GLOBAL DARK MODE + RTL
   One controller for every page
========================================================= */

(function () {
    "use strict";

    const DARK_KEY = "skylight-dark-mode";
    const RTL_KEY = "skylight-rtl";

    const DARK_SELECTORS =
        "#darkModeToggle, #loginThemeToggle, #registerThemeToggle";

    const RTL_SELECTORS =
        "#rtlToggle, #loginRtlToggle, #registerRtlToggle";

    function readSetting(key) {
        try {
            return localStorage.getItem(key) === "true";
        } catch (error) {
            return false;
        }
    }

    function saveSetting(key, value) {
        try {
            localStorage.setItem(key, String(value));
        } catch (error) {
            console.warn("Unable to save site preference:", error);
        }
    }

    function applyDarkMode(enabled, persist = true) {
        document.body.classList.toggle("dark-mode", enabled);

        document.querySelectorAll(DARK_SELECTORS).forEach(function (button) {
            const icon = button.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-moon", "fa-sun");
                icon.classList.add(enabled ? "fa-sun" : "fa-moon");
            }

            button.setAttribute("aria-pressed", String(enabled));
            button.setAttribute(
                "aria-label",
                enabled ? "Switch to light mode" : "Switch to dark mode"
            );
            button.title = enabled ? "Switch to light mode" : "Switch to dark mode";
        });

        if (persist) saveSetting(DARK_KEY, enabled);
    }

    function applyRTL(enabled, persist = true) {
        document.documentElement.setAttribute("dir", enabled ? "rtl" : "ltr");
        document.body.classList.toggle("rtl-mode", enabled);

        document.querySelectorAll(RTL_SELECTORS).forEach(function (button) {
            button.setAttribute("aria-pressed", String(enabled));
            button.setAttribute(
                "aria-label",
                enabled ? "Switch to left-to-right layout" : "Switch to right-to-left layout"
            );
            button.title = enabled ? "Switch to LTR" : "Switch to RTL";
        });

        if (persist) saveSetting(RTL_KEY, enabled);
    }

    function initialize() {
        applyDarkMode(readSetting(DARK_KEY), false);
        applyRTL(readSetting(RTL_KEY), false);
    }

    /*
     * CAPTURE PHASE:
     * Handle toggle clicks before old page-specific handlers.
     * Stop duplicate handlers from toggling the setting twice.
     */
    document.addEventListener("click", function (event) {
        const target = event.target instanceof Element
            ? event.target
            : event.target.parentElement;

        if (!target) return;

        const darkButton = target.closest(DARK_SELECTORS);

        if (darkButton) {
            event.preventDefault();
            event.stopImmediatePropagation();

            applyDarkMode(
                !document.body.classList.contains("dark-mode")
            );
            return;
        }

        const rtlButton = target.closest(RTL_SELECTORS);

        if (rtlButton) {
            event.preventDefault();
            event.stopImmediatePropagation();

            applyRTL(
                document.documentElement.getAttribute("dir") !== "rtl"
            );
        }
    }, true);

    /* Sync changes made in other open tabs */
    window.addEventListener("storage", function (event) {
        if (event.key === DARK_KEY) {
            applyDarkMode(event.newValue === "true", false);
        }

        if (event.key === RTL_KEY) {
            applyRTL(event.newValue === "true", false);
        }
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize, {
            once: true
        });
    } else {
        initialize();
    }

})();





/* RESPONSIVE HOME DROPDOWN TOGGLE */
document.addEventListener("DOMContentLoaded", function () {
    const dropdownItems = document.querySelectorAll(
        ".main-navigation .nav-item.has-dropdown"
    );

    dropdownItems.forEach(function (item) {
        const toggle = item.querySelector(".dropdown-toggle");

        if (!toggle) return;

        toggle.addEventListener("click", function (event) {
            event.preventDefault();

            const isOpen = item.classList.toggle("open");

            toggle.setAttribute("aria-expanded", String(isOpen));
        });
    });
});
















/* SCROLL TO TOP FUNCTIONALITY */

document.addEventListener("DOMContentLoaded", function () {
    const scrollTopBtn = document.getElementById("scrollTopBtn");

    if (!scrollTopBtn) return;

    function toggleScrollTopButton() {
        scrollTopBtn.classList.toggle("show", window.scrollY > 300);
    }

    window.addEventListener("scroll", toggleScrollTopButton, {
        passive: true
    });

    toggleScrollTopButton();

    scrollTopBtn.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});
