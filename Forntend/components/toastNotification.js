// Toast Notification Component
class ToastNotification {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    this.container = document.getElementById("message-container");
    if (!this.container) {
      // Create container if it doesn't exist
      this.container = document.createElement("div");
      this.container.id = "message-container";
      this.container.className = "message-container";
      document.body.appendChild(this.container);
    }
  }

  show(message, type = "info", duration = 5000) {
    const messageEl = document.createElement("div");
    messageEl.className = `message ${type}`;
    messageEl.innerHTML = `
            <i class="fas fa-${this.getIconForType(type)}"></i>
            <span>${message}</span>
        `;

    this.container.appendChild(messageEl);

    // Auto remove after specified duration
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.parentNode.removeChild(messageEl);
      }
    }, duration);

    return messageEl;
  }

  success(message, duration = 5000) {
    return this.show(message, "success", duration);
  }

  error(message, duration = 5000) {
    return this.show(message, "error", duration);
  }

  info(message, duration = 5000) {
    return this.show(message, "info", duration);
  }

  warning(message, duration = 5000) {
    return this.show(message, "warning", duration);
  }

  getIconForType(type) {
    switch (type) {
      case "success":
        return "check-circle";
      case "error":
        return "exclamation-triangle";
      case "info":
        return "info-circle";
      case "warning":
        return "exclamation-triangle";
      default:
        return "info-circle";
    }
  }

  // Clear all messages
  clear() {
    if (this.container) {
      this.container.innerHTML = "";
    }
  }

  // Remove a specific message
  remove(messageElement) {
    if (messageElement && messageElement.parentNode) {
      messageElement.parentNode.removeChild(messageElement);
    }
  }

  // Show a sticky message that doesn't auto-remove
  showSticky(message, type = "info") {
    const messageEl = document.createElement("div");
    messageEl.className = `message ${type} sticky`;
    messageEl.innerHTML = `
            <i class="fas fa-${this.getIconForType(type)}"></i>
            <span>${message}</span>
            <button class="message-close" onclick="this.parentNode.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

    // Add close button styles
    const closeBtn = messageEl.querySelector(".message-close");
    if (closeBtn) {
      closeBtn.style.cssText = `
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                padding: 0 0 0 10px;
                font-size: 14px;
            `;
    }

    this.container.appendChild(messageEl);
    return messageEl;
  }
}
