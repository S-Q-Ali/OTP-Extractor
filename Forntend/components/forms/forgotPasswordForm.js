// Forgot Password Form Component
class ForgotPasswordForm {
    constructor(onSubmitCallback) {
        this.onSubmit = onSubmitCallback;
        this.init();
    }

    init() {
        const form = document.getElementById('forgot-password-form');
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }
        
        // Initialize form validation
        this.initializeValidation();
    }

    initializeValidation() {
        const emailInput = document.getElementById('forgot-email');
        if (emailInput) {
            emailInput.addEventListener('input', () => this.validateEmail(emailInput));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('forgot-email');
        const email = emailInput.value;
        
        if (!email) {
            window.toast?.show('Please enter your email address', 'error');
            return;
        }

        if (!this.validateEmailFormat(email)) {
            window.toast?.show('Please enter a valid email address', 'error');
            return;
        }
        
        // Call the submit callback
        if (this.onSubmit) {
            await this.onSubmit(email);
        }
    }

    validateEmail(input) {
        const email = input.value;
        const isValid = this.validateEmailFormat(email);
        
        if (email && !isValid) {
            input.classList.add('error');
            this.showFieldError(input, 'Please enter a valid email address');
            return false;
        } else {
            input.classList.remove('error');
            this.hideFieldError(input);
            return true;
        }
    }

    validateEmailFormat(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showFieldError(input, message) {
        const errorEl = input.parentNode.parentNode.querySelector('.error-message');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }
    }

    hideFieldError(input) {
        const errorEl = input.parentNode.parentNode.querySelector('.error-message');
        if (errorEl) {
            errorEl.classList.remove('show');
        }
    }
}