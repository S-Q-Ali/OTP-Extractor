// Login Form Component
class LoginForm {
    constructor(onSubmitCallback) {
        this.onSubmit = onSubmitCallback;
        this.init();
    }

    init() {
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }
        
        // Initialize form validation
        this.initializeValidation();
    }

    initializeValidation() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (emailInput) {
            emailInput.addEventListener('input', () => this.validateEmail(emailInput));
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('input', () => this.validatePassword(passwordInput));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const email = emailInput.value;
        const password = passwordInput.value;
        
        // Validate email format
        if (!this.validateEmail(emailInput)) {
            window.toast?.show('Please enter a valid email address', 'error');
            return;
        }

        // Validate password length
        if (!this.validatePassword(passwordInput)) {
            window.toast?.show('Password must be at least 9 characters', 'error');
            return;
        }

        // Call the submit callback
        if (this.onSubmit) {
            await this.onSubmit(email, password);
        }
    }

    validateEmail(input) {
        const email = input.value;
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        
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

    validatePassword(input) {
        const password = input.value;
        const isValid = password.length >= 9;
        
        if (password && !isValid) {
            input.classList.add('error');
            this.showFieldError(input, 'Password must be at least 9 characters');
            return false;
        } else {
            input.classList.remove('error');
            this.hideFieldError(input);
            return true;
        }
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