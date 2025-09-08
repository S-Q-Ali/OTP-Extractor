// Main router and application initialization
// Global state
let currentUser = null;
let currentStep = "login";

// DOM elements
const screens = {
  login: document.getElementById("login-screen"),
  qrSetup: document.getElementById("qr-setup-screen"),
  totpVerification: document.getElementById("totp-verification-screen"),
  ghlEmail: document.getElementById("ghl-email-screen"),
  otpResult: document.getElementById("otp-result-screen"),
  success: document.getElementById("success-screen"),
  forgotPassword: document.getElementById("forgot-password-screen"),
  forgotPasswordOtp: document.getElementById("forgot-password-otp-screen"),
  newPassword: document.getElementById("new-password-screen"),
};

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
  initializeComponents();
  initializeEventListeners();
  showScreen("login-screen");
});

function initializeComponents() {
  // Initialize all form components
  window.loginForm = new LoginForm(handleLogin);
  window.totpForm = new TOTPForm(handleTOTPVerification);
  window.ghlEmailForm = new GHLEmailForm(handleGHLRequest);
  window.forgotPasswordForm = new ForgotPasswordForm(handleForgotPassword);
  window.forgotPasswordOTPForm = new ForgotPasswordOTPForm(
    handleForgotPasswordOTP
  );
  window.newPasswordForm = new NewPasswordForm(handleNewPassword);

  // Initialize utility components
  window.otpInput = new OTPInput();
  window.loader = new Loader();
  window.toast = new ToastNotification();
}

function initializeEventListeners() {
  // QR setup continue button
  document
    .getElementById("continue-to-verification")
    .addEventListener("click", function () {
      showScreen("totp-verification-screen");
    });

  // Resend link
  document
    .getElementById("resend-link")
    .addEventListener("click", function (e) {
      e.preventDefault();
      window.toast.show("Code resent successfully!", "success");
    });

  // Forgot password resend link
  document
    .getElementById("resend-forgot-link")
    .addEventListener("click", function (e) {
      e.preventDefault();
      window.toast.show("Reset code resent successfully!", "success");
    });

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const activeScreen = document.querySelector(".auth-card.active");
      const submitBtn = activeScreen?.querySelector(
        'button[type="submit"], .primary-btn'
      );
      if (submitBtn && !submitBtn.disabled) {
        submitBtn.click();
      }
    }

    if (e.key === "Escape") {
      const activeScreen = document.querySelector(".auth-card.active");
      const backBtn = activeScreen?.querySelector(".back-btn");
      if (backBtn) {
        backBtn.click();
      }
    }
  });
}

function showScreen(screenId) {
  // Hide all screens
  Object.values(screens).forEach((screen) => {
    if (screen) screen.classList.remove("active");
  });

  // Show target screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add("active");
  }
}

// Form handlers
async function handleLogin(email, password) {
  window.loader.show();

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    currentUser = { email };

    // Always show QR code setup after login
    generateQRCode(email);
    showScreen("qr-setup-screen");
    window.toast.show(
      "Welcome! Please set up two-factor authentication",
      "info"
    );
  } catch (error) {
    window.toast.show("Login failed. Please try again.", "error");
  } finally {
    window.loader.hide();
  }
}

async function handleTOTPVerification(code) {
  window.loader.show();

  try {
    // Simulate API call - accept any 6-digit code
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (code.length === 6 && /^\d{6}$/.test(code)) {
      window.toast.show("TOTP verified successfully!", "success");
      showScreen("ghl-email-screen");
    } else {
      throw new Error("Invalid code");
    }
  } catch (error) {
    window.toast.show("Please enter a valid 6-digit code", "error");
    // Clear OTP inputs
    const otpInputs = document.querySelectorAll(".otp-input");
    otpInputs.forEach((input) => {
      input.value = "";
      input.classList.remove("filled");
    });
    otpInputs[0]?.focus();
  } finally {
    window.loader.hide();
  }
}

async function handleGHLRequest(ghlEmail) {
  window.loader.show();

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Display the OTP
    document.getElementById("generated-otp").textContent = otp;
    document.getElementById("otp-email-display").textContent = ghlEmail;
    showScreen("otp-result-screen");
    window.toast.show(`Your latest OTP is: ${otp}`, "success");
  } catch (error) {
    window.toast.show("Failed to generate OTP. Please try again.", "error");
  } finally {
    window.loader.hide();
  }
}

async function handleForgotPassword(email) {
  window.loader.show();

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    window.toast.show("Reset code sent to your email!", "success");
    showScreen("forgot-password-otp-screen");
  } catch (error) {
    window.toast.show("Failed to send reset code. Please try again.", "error");
  } finally {
    window.loader.hide();
  }
}

async function handleForgotPasswordOTP(code) {
  window.loader.show();

  try {
    // Simulate API call - accept any 6-digit code
    await new Promise((resolve) => setTimeout(resolve, 1000));

    window.toast.show("Code verified successfully!", "success");
    showScreen("new-password-screen");
  } catch (error) {
    window.toast.show("Verification failed. Please try again.", "error");
  } finally {
    window.loader.hide();
  }
}

async function handleNewPassword(newPassword, confirmPassword) {
  window.loader.show();

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    window.toast.show("Password reset successfully!", "success");

    // Reset forms and go back to login
    document.getElementById("forgot-password-form").reset();
    document.getElementById("forgot-password-otp-form").reset();
    document.getElementById("new-password-form").reset();

    showScreen("login-screen");
  } catch (error) {
    window.toast.show("Failed to reset password. Please try again.", "error");
  } finally {
    window.loader.hide();
  }
}

// Utility functions
function copyOTP() {
  const otpCode = document.getElementById("generated-otp").textContent;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(otpCode).then(() => {
      window.toast.show("OTP copied to clipboard!", "success");
    });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = otpCode;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    window.toast.show("OTP copied to clipboard!", "success");
  }
}

function generateNewOTP() {
  const ghlEmail = document.getElementById("otp-email-display").textContent;

  window.loader.show();

  setTimeout(() => {
    // Generate new random 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    document.getElementById("generated-otp").textContent = newOtp;
    window.toast.show(`New OTP generated: ${newOtp}`, "success");
    window.loader.hide();
  }, 500);
}

function restartFlow() {
  // Reset form fields
  document.getElementById("login-form").reset();
  document.getElementById("ghl-form").reset();

  // Clear OTP inputs
  const otpInputs = document.querySelectorAll(".otp-input");
  otpInputs.forEach((input) => {
    input.value = "";
    input.classList.remove("filled");
  });

  // Reset state
  currentUser = null;
  currentStep = "login";

  // Show login screen
  showScreen("login-screen");
  window.toast.show("Session reset. Please log in again.", "info");
}

// QR Code Generation (simulate backend call)
function generateQRCode(email) {
  // Simulate API call to backend for QR code generation
  setTimeout(() => {
    const qrContainer = document.querySelector(".qr-container");
    const qrPlaceholder = qrContainer.querySelector(".qr-placeholder");

    // Create QR code image element
    const qrImg = document.createElement("img");
    qrImg.src = generateDummyQRCode(email);
    qrImg.alt = "TOTP QR Code";
    qrImg.style.width = "200px";
    qrImg.style.height = "200px";

    // Replace placeholder with actual QR code
    qrContainer.innerHTML = "";
    qrContainer.appendChild(qrImg);

    window.toast.show(
      "QR code generated! Scan with your authenticator app",
      "success"
    );
  }, 1000);
}

// Generate a dummy QR code (in real app, this would come from backend)
function generateDummyQRCode(email) {
  // Create a simple QR code-like pattern using canvas
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext("2d");

  // Create a checkered pattern to simulate QR code
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 200, 200);

  ctx.fillStyle = "#000000";
  const blockSize = 10;

  // Create random pattern based on email for consistency
  const seed = email
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  let random = seed;

  for (let x = 0; x < 200; x += blockSize) {
    for (let y = 0; y < 200; y += blockSize) {
      random = (random * 9301 + 49297) % 233280;
      if (random / 233280 > 0.5) {
        ctx.fillRect(x, y, blockSize, blockSize);
      }
    }
  }

  return canvas.toDataURL();
}

// Make utility functions available globally
window.showScreen = showScreen;
window.copyOTP = copyOTP;
window.generateNewOTP = generateNewOTP;
window.restartFlow = restartFlow;
