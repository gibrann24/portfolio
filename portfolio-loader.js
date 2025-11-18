// Portfolio Page Data Loader
class PortfolioPageLoader {
  constructor(dataUrl = "data.json") {
    this.dataUrl = dataUrl;
    this.data = null;
  }

  async loadData() {
    try {
      const response = await fetch(this.dataUrl);
      const fullData = await response.json();
      this.data = fullData.portfolio;
      return this.data;
    } catch (error) {
      console.error("Error loading portfolio data:", error);
      return null;
    }
  }

  createElement(tag, classes = [], attributes = {}) {
    const element = document.createElement(tag);
    if (classes.length) element.className = classes.join(" ");
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return element;
  }

  populatePortfolio() {
    if (!this.data) return;

    // Update title
    const pageTitle = document.querySelector(".portfolio-header h1");
    if (pageTitle) pageTitle.textContent = this.data.title;

    // Get main container
    const mainContainer = document.querySelector(".portfolio-page");
    if (!mainContainer) return;

    // Remove existing sections except header
    const existingSections =
      mainContainer.querySelectorAll(".portfolio-section");
    existingSections.forEach((section) => section.remove());

    // Create sections for each category
    this.data.categories.forEach((category) => {
      const section = this.createElement("section", ["portfolio-section"]);

      const heading = this.createElement("h2");
      heading.textContent = category.name;
      section.appendChild(heading);

      const grid = this.createElement("div", ["portfolio-grid"]);

      category.items.forEach((item) => {
        const article = this.createElement("article", ["portfolio-item"]);

        // Make item clickable if URL exists
        if (item.url) {
          article.style.cursor = "pointer";
          article.addEventListener("click", () => {
            window.open(item.url, "_blank");
          });
        }

        const thumbnail = this.createElement("div", ["portfolio-thumbnail"]);
        article.appendChild(thumbnail);

        const content = this.createElement("div", ["portfolio-content"]);

        const description = this.createElement("p");
        description.textContent = item.description;
        content.appendChild(description);

        // Group chips in sets based on array structure
        const chipsPerGroup = 4; // Maximum chips before creating new group
        let currentChipGroup = null;

        item.chips.forEach((chipText, index) => {
          if (index % chipsPerGroup === 0 || !currentChipGroup) {
            currentChipGroup = this.createElement("div", ["chip-group"]);
            content.appendChild(currentChipGroup);
          }

          const chip = this.createElement("span", ["chip"]);
          chip.textContent = chipText;
          currentChipGroup.appendChild(chip);
        });

        article.appendChild(content);
        grid.appendChild(article);
      });

      section.appendChild(grid);
      mainContainer.appendChild(section);
    });
  }

  async init() {
    await this.loadData();
    if (!this.data) return;

    this.populatePortfolio();
  }
}

// Auto-initialize on page load
document.addEventListener("DOMContentLoaded", async function () {
  const loader = new PortfolioPageLoader();
  await loader.init();

  // Initialize scroll animations after content is loaded
  if (window.ScrollAnimations) {
    new window.ScrollAnimations();
  }
});
