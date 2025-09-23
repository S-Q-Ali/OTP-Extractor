// src/components/screens/ForgotPasswordScreen.jsx
import { useState } from 'react'
import Loader from '../ui/Loader'
import styles from "../../styles/ForgotPassword/Forgot.module.css"

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
    <div id="forgot-password-screen" className={`${styles.authCard}${styles.active}`}>
      <div className={styles.cardHeader}>
        <button className={styles.backBtn} onClick={onBack}>
          <i className="fas fa-arrow-left"></i>
          Back to Login
        </button>

        <div className={styles.securityIcon}>
          <i className="fas fa-key"></i>
        </div>
        <h2>Reset Password</h2>
        <p>Enter your registered email address</p>
      </div>

      <Loader isLoading={isLoading}>
        <form className= {styles.authForm} onSubmit={handleSubmit}>
          <div className= {styles.formGroup}>
            <label htmlFor="forgot-email">Email Address</label>
            <div className={styles.inputField}>
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="forgot-email"
                value={email}
                onChange={handleInputChange}
                placeholder="Enter your registered email"
                required
                className={error ? styles.error : ''}
              />
            </div>
            {error && <div className={`${styles.errorMessage}${styles.show}`}>{error}</div>}
          </div>

          <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
            <i className="fas fa-paper-plane"></i>
            Send Reset Code
          </button>
        </form>
      </Loader>
    </div>
  )
}

export default ForgotPasswordScreen