// OTP Input Component
class OTPInput {
  constructor() {
    this.init();
  }

  init() {
    // Initialize all OTP inputs on the page
    this.initializeOTPInputs();
  }

  initializeOTPInputs() {
    const otpInputs = document.querySelectorAll(".otp-input");

    otpInputs.forEach((input, index) => {
      input.addEventListener("input", (e) =>
        this.handleInputChange(e, index, otpInputs)
      );
      input.addEventListener("keydown", (e) =>
        this.handleKeyDown(e, index, otpInputs)
      );
      input.addEventListener("paste", (e) =>
        this.handlePaste(e, index, otpInputs)
      );
    });
  }

  handleInputChange(e, index, allInputs) {
    const value = e.target.value;
    const container = e.target.closest(".otp-input-container");
    const otpInputs = container
      ? container.querySelectorAll(".otp-input")
      : allInputs;

    // Only allow digits
    if (!/^\d$/.test(value) && value !== "") {
      e.target.value = "";
      return;
    }

    // Add filled class
    if (value) {
      e.target.classList.add("filled");

      // Move to next input in the same container
      const currentIndex = Array.from(otpInputs).indexOf(e.target);
      if (currentIndex < otpInputs.length - 1) {
        otpInputs[currentIndex + 1].focus();
      }
    } else {
      e.target.classList.remove("filled");
    }
  }

  handleKeyDown(e, index, allInputs) {
    const container = e.target.closest(".otp-input-container");
    const otpInputs = container
      ? container.querySelectorAll(".otp-input")
      : allInputs;
    const currentIndex = Array.from(otpInputs).indexOf(e.target);

    // Handle backspace
    if (e.key === "Backspace" && !e.target.value && currentIndex > 0) {
      otpInputs[currentIndex - 1].focus();
      otpInputs[currentIndex - 1].value = "";
      otpInputs[currentIndex - 1].classList.remove("filled");
    }
  }

  handlePaste(e, index, allInputs) {
    e.preventDefault();
    const container = e.target.closest(".otp-input-container");
    const otpInputs = container
      ? container.querySelectorAll(".otp-input")
      : allInputs;
    const currentIndex = Array.from(otpInputs).indexOf(e.target);

    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");

    for (
      let i = 0;
      i < Math.min(pasteData.length, otpInputs.length - currentIndex);
      i++
    ) {
      otpInputs[currentIndex + i].value = pasteData[i];
      otpInputs[currentIndex + i].classList.add("filled");
    }
  }

  // Clear all OTP inputs in a specific container
  clearInputs(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      const otpInputs = container.querySelectorAll(".otp-input");
      otpInputs.forEach((input) => {
        input.value = "";
        input.classList.remove("filled");
      });
      otpInputs[0]?.focus();
    }
  }

  // Fill OTP inputs with a specific code (for demo/testing)
  fillCode(containerId, code) {
    const container = document.getElementById(containerId);
    if (container) {
      const otpInputs = container.querySelectorAll(".otp-input");
      for (let i = 0; i < Math.min(code.length, otpInputs.length); i++) {
        otpInputs[i].value = code[i];
        otpInputs[i].classList.add("filled");
      }
    }
  }
}
