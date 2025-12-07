// Data Loader for Portfolio
class PortfolioDataLoader {
  constructor(dataUrl = "data.json") {
    this.dataUrl = dataUrl;
    this.data = null;
  }

  async loadData() {
    try {
      const response = await fetch(this.dataUrl);
      this.data = await response.json();
      return this.data;
    } catch (error) {
      console.error("Error loading data:", error);
      return null;
    }
  }

  // Helper: Create element with classes and attributes
  createElement(tag, classes = [], attributes = {}) {
    const element = document.createElement(tag);
    if (classes.length) element.className = classes.join(" ");
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return element;
  }

  // Helper: Create iconify span
  createIcon(iconName) {
    const span = this.createElement("span", ["iconify"]);
    span.setAttribute("data-icon", iconName);
    return span;
  }

  // Populate Hero Section
  populateHero() {
    const { hero } = this.data;

    // Availability
    const availabilityText = document.querySelector(
      ".availability span:not(.indicator)"
    );
    if (availabilityText) availabilityText.textContent = hero.availability.text;

    const indicator = document.querySelector(".indicator");
    if (indicator) {
      indicator.className = `indicator ${hero.availability.status}`;
    }

    // Greeting and intro
    const greeting = document.querySelector(".hero h1");
    if (greeting) greeting.innerHTML = hero.greeting;

    const intro = document.querySelector(".intro");
    if (intro) intro.textContent = hero.intro;

    // Resume link
    const resumeBtn = document.querySelector(".btn-primary[download]");
    if (resumeBtn) resumeBtn.href = hero.resumeLink;

    // Social links
    const socialContainer = document.querySelector(".social-links");
    if (socialContainer) {
      socialContainer.innerHTML = "";
      hero.socialLinks.forEach((social) => {
        const brand = social.name.toLowerCase().replace(/\s+/g, "-");
        const link = this.createElement("a", [], {
          href: social.url,
          "aria-label": social.name,
        });
        link.dataset.brand = brand;
        if (social.type === "img") {
          const img = this.createElement("img", [], {
            src: social.icon,
            alt: social.name,
          });
          img.classList.add("social-icon-img");
          link.appendChild(img);
        } else {
          link.appendChild(this.createIcon(social.icon));
        }
        socialContainer.appendChild(link);
      });
    }
  }


// Populate Featured Work
populateFeaturedWork() {
  const { featuredWork } = this.data;

  const title = document.querySelector(".work h2");
  if (title) title.textContent = featuredWork.title;

  const grid = document.querySelector(".card-grid");
  if (grid) {
    grid.innerHTML = "";
    featuredWork.projects.forEach((project) => {
      const article = this.createElement("article", ["project-card"]);

      // Make card clickable if URL exists
      if (project.url) {
        article.style.cursor = "pointer";
        article.addEventListener("click", () => {
          window.open(project.url, "_blank");
        });
      }

      const thumbnail = this.createElement("div", ["thumbnail"]);
      // <-- NEW: apply thumbnail image from data.json -->
      if (project.thumbnail && project.thumbnail.length > 0) {
        thumbnail.style.backgroundImage = `url(${project.thumbnail})`;
      } else {
        // optional fallback image if none provided
        thumbnail.style.backgroundImage = `url('./assets/placeholder.png')`;
      }
      // recommended sizing to avoid zooming/cropping
      thumbnail.style.backgroundSize = "contain";
      thumbnail.style.backgroundPosition = "center";
      thumbnail.style.backgroundRepeat = "no-repeat";

      const content = this.createElement("div", ["project-content"]);
      const heading = this.createElement("h3");
      heading.textContent = project.title;

      const chipGroup = this.createElement("div", ["chip-group"]);
      project.chips.forEach((chipText) => {
        const chip = this.createElement("span", ["chip"]);
        chip.textContent = chipText;
        chipGroup.appendChild(chip);
      });

      content.appendChild(heading);
      content.appendChild(chipGroup);
      article.appendChild(thumbnail);
      article.appendChild(content);
      grid.appendChild(article);
    });
  }
}


  // Populate Experience Section
  populateExperience() {
    const { experience } = this.data;

    const title = document.querySelector(".experience h2");
    if (title) title.textContent = experience.title;

    const timeline = document.querySelector(".timeline");
    if (timeline) {
      timeline.innerHTML = "";

      experience.companies.forEach((company) => {
        const article = this.createElement("article", ["company"]);

        // console.log("Badge image:", company.badgeImage);

        const badge = this.createElement("div", ["company-badge"]);
        badge.setAttribute("data-variant", company.badge);

        const badgeImg = this.createElement("img", ["company-badge-img"]);
        badgeImg.src = company.badgeImage;
        badgeImg.alt = `${company.name} badge`;
        badge.appendChild(badgeImg);
        

        const content = this.createElement("div", ["company-content"]);

        // Company header
        const header = this.createElement("div", ["company-header"]);
        const name = this.createElement("h3", ["company-name"]);
        name.textContent = company.name;

        const toggleBtn = this.createElement("button", ["company-toggle"]);
        toggleBtn.appendChild(this.createIcon("mdi:chevron-down"));

        header.appendChild(name);
        header.appendChild(toggleBtn);

        // Job list
        const jobList = this.createElement("div", ["job-list"]);

        company.jobs.forEach((job) => {
          const jobCard = this.createElement("div", ["job-card"]);

          // Job header
          const jobHeader = this.createElement("div", ["job-header"]);
          const jobTitle = this.createElement("h4", ["job-title"]);
          jobTitle.textContent = job.title;

          const duration = this.createElement("span", ["job-duration"]);
          duration.textContent = job.duration;

          const titleWrapper = this.createElement("div", ["job-title-wrapper"]);
          titleWrapper.appendChild(jobTitle);
          titleWrapper.appendChild(duration);

          if (job.totalDuration) {
            const totalDuration = this.createElement("span", ["job-total-duration"]);
            totalDuration.textContent = job.totalDuration;
            jobHeader.appendChild(titleWrapper);
            jobHeader.appendChild(totalDuration);
          } else {
            jobHeader.appendChild(titleWrapper);
          }

          // Job meta
          const meta = this.createElement("p", ["job-meta"]);
          meta.textContent = job.type
            ? `${job.location} | ${job.type}`
            : job.location;

        // Job description
const descWrapper = this.createElement("div", ["job-description"]);

const readMore = this.createElement("button", ["job-readmore", "read-more-btn"]);
readMore.textContent = "Read more...";

const readLess = this.createElement("button", ["job-readmore", "read-less-btn"]);
readLess.textContent = "…Read less";
readLess.style.display = "none";

// ----- PREVIEW SECTION -----
const preview = this.createElement("div", ["description-preview"]);
const previewList = this.createElement("ul");

// If preview is an array → create bullet points
if (Array.isArray(job.descriptionPreview)) {
  job.descriptionPreview.forEach(item => {
    const li = this.createElement("li");
    li.textContent = item;
    previewList.appendChild(li);
  });
} else {
  // If it's a string → still show it inside <li>
  const li = this.createElement("li");
  li.textContent = job.descriptionPreview;
  previewList.appendChild(li);
}

preview.appendChild(previewList);
preview.appendChild(readMore);

// ----- FULL SECTION -----
const full = this.createElement("div", ["description-full"]);
const fullList = this.createElement("ul");

if (Array.isArray(job.descriptionFull)) {
  job.descriptionFull.forEach(item => {
    const li = this.createElement("li");
    li.textContent = item;
    fullList.appendChild(li);
  });
} else {
  const li = this.createElement("li");
  li.textContent = job.descriptionFull;
  fullList.appendChild(li);
}

full.appendChild(fullList);
full.appendChild(readLess);

        

          descWrapper.appendChild(preview);
          descWrapper.appendChild(full);

          jobCard.appendChild(jobHeader);
          jobCard.appendChild(meta);
          jobCard.appendChild(descWrapper);
          jobList.appendChild(jobCard);
        });

        content.appendChild(header);
        content.appendChild(jobList);
        article.appendChild(badge);
        article.appendChild(content);
        timeline.appendChild(article);
      });
    }
  }

  // Populate Education Section
  populateEducation() {
    const { education } = this.data;

    const title = document.querySelector(".education h2");
    if (title) title.textContent = education.title;

    const list = document.querySelector(".education-list");
    if (list) {
      list.innerHTML = "";

      education.items.forEach((item) => {
        const article = this.createElement("article", ["education-item"]);

        // const badge = this.createElement("div", ["education-badge"]);
        // badge.setAttribute("data-variant", item.badge);

        const badge = this.createElement("div", ["education-badge"]);

        const img = document.createElement("img");
        // img.src = item.badge;  // badge path comes from JSON
        img.src = item["badge-image"];
        img.alt = item.institution + " logo";

badge.appendChild(img);

        const content = this.createElement("div", ["education-content"]);

        if (item.degree) {
          const wrapper = this.createElement("div", ["content-1"]);
          const institution = this.createElement("h3", ["institution-name"]);
          institution.textContent = item.institution;
          const degree = this.createElement("p", ["degree"]);
          degree.textContent = item.degree;
          wrapper.appendChild(institution);
          wrapper.appendChild(degree);
          content.appendChild(wrapper);
        } else {
          const institution = this.createElement("h3", ["institution-name"]);
          institution.textContent = item.institution;
          content.appendChild(institution);
        }

        if (item.period) {
          const period = this.createElement("p", ["education-meta"]);
          period.textContent = item.period;
          content.appendChild(period);
        }

        const description = this.createElement("p", ["education-description"]);
        description.textContent = item.description;
        content.appendChild(description);


        //----ACTIVATE THIS IF YOU WANT TO USE A BULLET POINT----
        // if (item.description && Array.isArray(item.description)) {
        //   const ul = this.createElement("ul", ["education-description"]);
        //   item.description.forEach(point => {
        //     const li = document.createElement("li");
        //     li.textContent = point;
        //     ul.appendChild(li);
        //   });
        //   content.appendChild(ul);
        // }

        article.appendChild(badge);
        article.appendChild(content);
        list.appendChild(article);
      });
    }
  }

  // Populate Tools Section
  populateTools() {
    const { tools } = this.data;

    const title = document.querySelector(".tools h2");
    if (title) title.textContent = tools.title;

    const grid = document.querySelector(".tools-grid");
    if (grid) {
      grid.innerHTML = "";

      tools.categories.forEach((category) => {
        const div = this.createElement("div", ["tool-category"]);

        const heading = this.createElement("h3");
        heading.textContent = category.name;

        const iconsContainer = this.createElement("div", ["tool-icons"]);

        // category.tools.forEach((tool) => {
        //   const iconDiv = this.createElement("div", ["tool-icon"]);

        //   if (tool.type === "svg") {
        //     const img = this.createElement("img", [], {
        //       src: tool.icon,
        //       alt: tool.name,
        //     });
        //     iconDiv.appendChild(img);
        //   } else if (tool.type === "iconify") {
        //     const span = this.createIcon(tool.icon);
        //     span.style.fontSize = "48px";
        //     iconDiv.appendChild(span);
        //   }

        //   iconsContainer.appendChild(iconDiv);
        // });

        category.tools.forEach((tool) => {
          const iconDiv = this.createElement("div", ["tool-icon"]);
        
          if (tool.type === "svg") {
            const img = this.createElement("img", [], {
              src: tool.icon,
              alt: tool.name,
            });
            iconDiv.appendChild(img);
          } else if (tool.type === "iconify") {
            const span = this.createIcon(tool.icon);
            span.style.fontSize = "48px";
            iconDiv.appendChild(span);
          } else if (tool.type === "image") {
            const img = this.createElement("img", [], {
              src: tool.icon,
              alt: tool.name,
            });
            iconDiv.appendChild(img);
          }
        
          iconsContainer.appendChild(iconDiv);
        });
        



        div.appendChild(heading);
        div.appendChild(iconsContainer);
        grid.appendChild(div);
      });
    }
  }

  // Populate Contact Section
  populateContact() {
    const { contact } = this.data;

    const title = document.querySelector(".contact h2");
    if (title) title.textContent = contact.title;

    const contactGrid = document.querySelector(".contact-grid");
    if (contactGrid) {
      contactGrid.innerHTML = "";

      // Create cards twice for infinite loop
      const createCards = () => {
        return contact.persons.map((person) => {
          const article = this.createElement("article", ["contact-card"]);

          const name = this.createElement("h3");
          name.textContent = person.name;

          const subtitle = this.createElement("p", ["contact-subtitle"]);
          subtitle.textContent = person.subtitle;

          const detail = this.createElement("p", ["contact-detail"]);
          detail.textContent = person.detail;

          article.appendChild(name);
          article.appendChild(subtitle);
          article.appendChild(detail);

          return article;
        });
      };

      // Append cards twice for loop
      createCards().forEach((card) => contactGrid.appendChild(card));
      createCards().forEach((card) => contactGrid.appendChild(card));
    }
  }

  // Populate CTA Section
  populateCTA() {
    const { cta } = this.data;

    const title = document.querySelector(".cta h2");
    if (title) title.textContent = cta.title;

    const subtitle = document.querySelector(".cta p");
    if (subtitle) subtitle.textContent = cta.subtitle;
  }

  // Populate Footer
  populateFooter() {
    const { footer } = this.data;

    const text = document.querySelector(".footer p");
    if (text) text.textContent = footer.text;
  }

  // Initialize all sections
  async init() {
    await this.loadData();
    if (!this.data) return;

    this.populateHero();
    this.populateFeaturedWork();
    this.populateExperience();
    this.populateEducation();
    this.populateTools();
    this.populateContact();
    this.populateCTA();
    this.populateFooter();
  }
}

// Export for use
if (typeof module !== "undefined" && module.exports) {
  module.exports = PortfolioDataLoader;
}
