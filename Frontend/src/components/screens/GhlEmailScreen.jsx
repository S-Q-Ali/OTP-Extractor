// src/components/screens/GhlEmailScreen.jsx
import { useState } from 'react'
import Loader from '../ui/Loader'

const GhlEmailScreen = ({ onRequestOTP, showToast }) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError('Please enter your GHL email address')
      showToast('Please enter your GHL email address', 'error')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      showToast('Please enter a valid email address', 'error')
      return
    }

    setIsLoading(true)
    try {
      await onRequestOTP(email)
    } catch (error) {
      showToast('Failed to generate OTP. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setEmail(e.target.value)
    if (error) setError('')
  }

  return (
    <div id="ghl-email-screen" className="auth-card active">
      <div className="card-header">
        <div className="security-icon">
          <i className="fas fa-lock"></i>
        </div>
        <h2>Secure OTP Verification</h2>
        <p>
          Enter your details below to receive a one-time password for secure access
        </p>
      </div>

      <Loader isLoading={isLoading}>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="ghl-email">GHL Email Address</label>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="ghl-email"
                value={email}
                onChange={handleInputChange}
                placeholder="Enter your GHL email address"
                required
                className={error ? 'error' : ''}
              />
            </div>
            {error && <div className="error-message show">{error}</div>}
          </div>

          <button type="submit" className="primary-btn" disabled={isLoading}>
            <i className="fas fa-key"></i>
            Get OTP
          </button>

          <div className="form-footer">
            <div className="terms-notice">
              By requesting an OTP, you agree to our
              <a href="#">Terms of Service</a> and
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </form>
      </Loader>
    </div>
  )
}

export default GhlEmailScreen