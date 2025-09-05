// New Password Form Component
class NewPasswordForm {
    constructor(onSubmitCallback) {
        this.onSubmit = onSubmitCallback;
        this.init();
    }

    init() {
        const form = document.getElementById('new-password-form');
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }
        
        // Initialize form validation
        this.initializeValidation();
    }

    initializeValidation() {
        const newPasswordInput = document.getElementById('new-password');
        const confirmPasswordInput = document.getElementById('confirm-password');

        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', () => this.validatePassword(newPasswordInput));
        }
        
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => this.validatePasswordMatch(confirmPasswordInput));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const newPasswordInput = document.getElementById('new-password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (!newPassword || !confirmPassword) {
            window.toast?.show('Please fill in both password fields', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            this.showFieldError(confirmPasswordInput, 'Passwords do not match');
            window.toast?.show('Passwords do not match', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            window.toast?.show('Password must be at least 6 characters long', 'error');
            return;
        }
        
        // Call the submit callback
        if (this.onSubmit) {
            await this.onSubmit(newPassword, confirmPassword);
        }
    }

    validatePassword(input) {
        const password = input.value;
        const isValid = password.length >= 6;
        
        if (password && !isValid) {
            input.classList.add('error');
            this.showFieldError(input, 'Password must be at least 6 characters long');
            return false;
        } else {
            input.classList.remove('error');
            this.hideFieldError(input);
            return true;
        }
    }

    validatePasswordMatch(input) {
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = input.value;
        const isValid = newPassword === confirmPassword;
        
        if (confirmPassword && !isValid) {
            input.classList.add('error');
            this.showFieldError(input, 'Passwords do not match');
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