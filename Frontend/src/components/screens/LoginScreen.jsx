// src/components/screens/LoginScreen.jsx
import { useState } from 'react'
import Loader from '../ui/Loader'
import { API_ENDPOINTS, apiRequest } from '../../config/api'

const LoginScreen = ({ onLogin, onShowForgotPassword, onShowTOTP, onShowQR, showToast }) => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePassword = (password) => password.length >= 9

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Update handleAutoRegister
const handleAutoRegister = async (email, password) => {
  try {
    showToast('Creating new account...', 'info')
    
    const response = await apiRequest(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password,
        name: email.split('@')[0]
      })
    });

    // Store the secret temporarily for debugging
    console.log('Registration successful. Secret:', response.secret);
    
    showToast('Account created! Please scan the QR code', 'success')
    return response
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      // User already exists, try login instead
      showToast('Account already exists. Please login.', 'info');
      throw new Error('Please use the login option instead');
    }
    throw new Error(`Registration failed: ${error.message}`);
  }
}

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const newErrors = {}
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 9 characters'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      // First try to login
      const response = await apiRequest(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      if (response.requiresOtp) {
        // Existing user, proceed to TOTP verification
        showToast('Password valid. Please enter your TOTP code', 'success')
        onShowTOTP(formData.email)
      }

    } catch (loginError) {
      // If login fails with 401, try to auto-register
      if (loginError.message.includes('Invalid email or password')) {
        try {
          const registerResponse = await handleAutoRegister(formData.email, formData.password)
          
          // New user registered, show QR code for setup
          onShowQR(formData.email, registerResponse.qrCode)
          
        } catch (registerError) {
          showToast(registerError.message, 'error')
        }
      } else {
        showToast(loginError.message, 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div id="login-screen" className="auth-card active">
      <div className="card-header">
        <div className="security-icon">
          <i className="fas fa-lock"></i>
        </div>
        <h2>Secure Login Portal</h2>
        <p>Sign in to access your dashboard</p>
      </div>

      <Loader isLoading={isLoading}>
        <form id="login-form" className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="user@example.com"
                required
                className={errors.email ? 'error' : ''}
              />
            </div>
            {errors.email && <div className="error-message show">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••••"
                required
                className={errors.password ? 'error' : ''}
              />
            </div>
            {errors.password && <div className="error-message show">{errors.password}</div>}
          </div>

          <button type="submit" className="primary-btn" disabled={isLoading}>
            <i className="fas fa-sign-in-alt"></i>
            Sign In / Register
          </button>

          <div className="form-footer">
            <a href="#" className="forgot-link" onClick={onShowForgotPassword}>
              Forgot your password?
            </a>
            <div className="security-notice">
              <i className="fas fa-shield-alt"></i>
              Protected by end-to-end encryption
            </div>
          </div>
        </form>
      </Loader>
    </div>
  )
}

export default LoginScreen