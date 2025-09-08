// Loader Component
class Loader {
  constructor() {
    this.init();
  }

  init() {
    // No specific initialization needed for loader
    // Loading states are handled by CSS classes
  }

  show() {
    const activeCard = document.querySelector(".auth-card.active");
    if (activeCard) {
      activeCard.classList.add("loading");
    }
  }

  hide() {
    const activeCard = document.querySelector(".auth-card.active");
    if (activeCard) {
      activeCard.classList.remove("loading");
    }
  }

  // Show loader on specific element
  showOnElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add("loading");
    }
  }

  // Hide loader on specific element
  hideOnElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove("loading");
    }
  }

  // Create a custom loader overlay
  createOverlay(parentElement) {
    const overlay = document.createElement("div");
    overlay.className = "loader-overlay";
    overlay.innerHTML = `
            <div class="loader-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading...</p>
            </div>
        `;

    // Add overlay styles
    overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--border-radius);
            z-index: 1000;
        `;

    const spinner = overlay.querySelector(".loader-spinner");
    spinner.style.cssText = `
            text-align: center;
            color: var(--white);
        `;

    parentElement.style.position = "relative";
    parentElement.appendChild(overlay);

    return overlay;
  }

  // Remove custom loader overlay
  removeOverlay(overlay) {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }
}
