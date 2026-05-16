const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("main section[id]");
const galleryUpload = document.querySelector("#galleryUpload");
const galleryGrid = document.querySelector("#galleryGrid");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".section, .card, .project-card, .timeline-item").forEach((element) => {
  element.classList.add("reveal");
  revealObserver.observe(element);
});

if (galleryUpload && galleryGrid) {
  galleryUpload.addEventListener("change", (event) => {
    const files = [...event.target.files].filter((file) => file.type.startsWith("image/"));

    files.forEach((file) => {
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        const item = document.createElement("article");
        const image = document.createElement("img");
        const caption = document.createElement("div");
        const title = document.createElement("h3");
        const description = document.createElement("p");
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]+/g, " ")
          .trim();

        item.className = "gallery-item reveal visible";
        image.src = reader.result;
        image.alt = cleanName || "Gallery photo";
        caption.className = "gallery-caption";
        title.textContent = cleanName || "Gallery Photo";
        description.textContent = "New gallery preview";
        caption.append(title, description);
        item.append(image, caption);

        galleryGrid.prepend(item);
      });

      reader.readAsDataURL(file);
    });

    galleryUpload.value = "";
  });
}

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  }
);

sections.forEach((section) => activeObserver.observe(section));
