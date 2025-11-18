// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    this.observer = null;
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setupObserver());
    } else {
      this.setupObserver();
    }
  }

  setupObserver() {
    // Create Intersection Observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");

          // Add staggered animation for children if they exist
          const children = entry.target.querySelectorAll(".stagger-item");
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add("animate-in");
            }, index * 100); // 100ms delay between each item
          });
        }
      });
    }, this.observerOptions);

    // Observe elements after a short delay to ensure DOM is fully loaded
    setTimeout(() => {
      this.observeElements();
    }, 100);
  }

  observeElements() {
    // Elements to animate
    const animatedElements = document.querySelectorAll(`
      .hero,
      .scroll-indicator,
      .work,
      .experience-cta,
      .experience,
      .education,
      .tools,
      .contact,
      .cta,
      .portfolio-header,
      .portfolio-section
    `);

    // Add animation class to elements
    animatedElements.forEach((el) => {
      el.classList.add("scroll-animate");
      this.observer.observe(el);
    });

    // Add stagger animation to specific items
    this.setupStaggerItems();
  }

  setupStaggerItems() {
    // Project cards
    const projectCards = document.querySelectorAll(".project-card");
    projectCards.forEach((card) =>
      card.classList.add("stagger-item", "scroll-animate")
    );

    // Portfolio items
    const portfolioItems = document.querySelectorAll(".portfolio-item");
    portfolioItems.forEach((item) =>
      item.classList.add("stagger-item", "scroll-animate")
    );

    // Company items
    const companies = document.querySelectorAll(".company");
    companies.forEach((company) =>
      company.classList.add("stagger-item", "scroll-animate")
    );

    // Education items
    const educationItems = document.querySelectorAll(".education-item");
    educationItems.forEach((item) =>
      item.classList.add("stagger-item", "scroll-animate")
    );

    // Tool categories
    const toolCategories = document.querySelectorAll(".tool-category");
    toolCategories.forEach((cat) =>
      cat.classList.add("stagger-item", "scroll-animate")
    );

    // Contact cards
    const contactCards = document.querySelectorAll(".contact-card");
    contactCards.forEach((card, index) => {
      // Only animate first 4 (not duplicates)
      if (index < 4) {
        card.classList.add("stagger-item", "scroll-animate");
      }
    });
  }
}

// Don't auto-initialize - will be called after content is loaded
// Export to global scope
window.ScrollAnimations = ScrollAnimations;
