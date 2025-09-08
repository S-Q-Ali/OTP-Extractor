// TOTP Form Component
class TOTPForm {
  constructor(onSubmitCallback) {
    this.onSubmit = onSubmitCallback;
    this.init();
  }

  init() {
    const form = document.getElementById("totp-form");
    if (form) {
      form.addEventListener("submit", this.handleSubmit.bind(this));
    }

    // Initialize OTP inputs
    this.initializeOTPInputs();
  }

  initializeOTPInputs() {
    const otpInputs = document.querySelectorAll(
      "#totp-verification-screen .otp-input"
    );

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

  handleInputChange(e, index, otpInputs) {
    const value = e.target.value;

    // Only allow digits
    if (!/^\d$/.test(value) && value !== "") {
      e.target.value = "";
      return;
    }

    // Add filled class
    if (value) {
      e.target.classList.add("filled");

      // Move to next input
      if (index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    } else {
      e.target.classList.remove("filled");
    }
  }

  handleKeyDown(e, index, otpInputs) {
    // Handle backspace
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpInputs[index - 1].focus();
      otpInputs[index - 1].value = "";
      otpInputs[index - 1].classList.remove("filled");
    }
  }

  handlePaste(e, index, otpInputs) {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");

    for (
      let i = 0;
      i < Math.min(pasteData.length, otpInputs.length - index);
      i++
    ) {
      otpInputs[index + i].value = pasteData[i];
      otpInputs[index + i].classList.add("filled");
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    const otpInputs = document.querySelectorAll(
      "#totp-verification-screen .otp-input"
    );
    const code = Array.from(otpInputs)
      .map((input) => input.value)
      .join("");

    if (code.length !== 6) {
      window.toast?.show("Please enter all 6 digits", "error");
      return;
    }

    // Call the submit callback
    if (this.onSubmit) {
      await this.onSubmit(code);
    }
  }
}
