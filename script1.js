// Portfolio Interactive Functionality
document.addEventListener("DOMContentLoaded", async function () {
  // ========================================
  // Load Data First
  // ========================================
  const dataLoader = new PortfolioDataLoader();
  await dataLoader.init();

  // ========================================
  // Job Description Accordion (Read More/Less)
  // ========================================
  const readMoreButtons = document.querySelectorAll(".read-more-btn");
  const readLessButtons = document.querySelectorAll(".read-less-btn");

  readMoreButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const description = this.closest(".job-description");
      const readLess = description.querySelector(".read-less-btn");
      
      description.classList.add("expanded");
      this.style.display = "none";
      if (readLess) readLess.style.display = "inline";
    });
  });

  readLessButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const description = this.closest(".job-description");
      const readMore = description.querySelector(".read-more-btn");
      
      description.classList.remove("expanded");
      this.style.display = "none";
      if (readMore) readMore.style.display = "inline";
    });
  });

  // ========================================
  // Company Accordion (Only One Open at a Time)
  // ========================================
  const companies = document.querySelectorAll(".company");
  const companyToggles = document.querySelectorAll(".company-toggle");
  const companyHeaders = document.querySelectorAll(".company-header");

  // Function to close all companies except the one passed as parameter
  function closeAllExcept(currentCompany) {
    companies.forEach((company) => {
      if (company !== currentCompany) {
        company.classList.add("collapsed");
      }
    });
  }

  // Toggle button click handler
  companyToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      const company = this.closest(".company");
      const isCurrentlyCollapsed = company.classList.contains("collapsed");

      // Close all other companies
      closeAllExcept(company);

      // Toggle current company
      if (isCurrentlyCollapsed) {
        company.classList.remove("collapsed");
      } else {
        company.classList.add("collapsed");
      }
    });
  });

  // Company header click handler
  companyHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const company = this.closest(".company");
      const isCurrentlyCollapsed = company.classList.contains("collapsed");

      // Close all other companies
      closeAllExcept(company);

      // Toggle current company
      if (isCurrentlyCollapsed) {
        company.classList.remove("collapsed");
      } else {
        company.classList.add("collapsed");
      }
    });
  });

  // Initialize: Open first company by default, close others
  if (companies.length > 0) {
    companies.forEach((company, index) => {
      if (index !== 0) {
        company.classList.add("collapsed");
      }
    });
  }

  // ========================================
  // Initialize Scroll Animations
  // ========================================
  // Initialize after all content is loaded
  if (window.ScrollAnimations) {
    new window.ScrollAnimations();
  }
});
