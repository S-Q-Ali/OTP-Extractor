// src/components/screens/ForgotPasswordScreen.jsx
import { useState } from 'react'
import Loader from '../ui/Loader'

const ForgotPasswordScreen = ({ onRequestCode, onBack, showToast }) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError('Please enter your email address')
      showToast('Please enter your email address', 'error')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      showToast('Please enter a valid email address', 'error')
      return
    }

    setIsLoading(true)
    try {
      await onRequestCode(email)
    } catch (error) {
      showToast('Failed to send reset code. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setEmail(e.target.value)
    if (error) setError('')
  }

  return (
    <div id="forgot-password-screen" className="auth-card active">
      <div className="card-header">
        <button className="back-btn" onClick={onBack}>
          <i className="fas fa-arrow-left"></i>
          Back to Login
        </button>

        <div className="security-icon">
          <i className="fas fa-key"></i>
        </div>
        <h2>Reset Password</h2>
        <p>Enter your registered email address</p>
      </div>

      <Loader isLoading={isLoading}>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="forgot-email">Email Address</label>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="forgot-email"
                value={email}
                onChange={handleInputChange}
                placeholder="Enter your registered email"
                required
                className={error ? 'error' : ''}
              />
            </div>
            {error && <div className="error-message show">{error}</div>}
          </div>

          <button type="submit" className="primary-btn" disabled={isLoading}>
            <i className="fas fa-paper-plane"></i>
            Send Reset Code
          </button>
        </form>
      </Loader>
    </div>
  )
}

export default ForgotPasswordScreen