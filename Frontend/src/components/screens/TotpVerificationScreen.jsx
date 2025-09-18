// src/components/screens/TotpVerificationScreen.jsx - FIXED
import { useState, useRef } from 'react'
import Loader from '../ui/Loader'
import OtpInput from '../ui/OtpInput'
import { API_ENDPOINTS, apiRequest } from '../../config/api'

const TotpVerificationScreen = ({ userEmail, onVerify, onBack, showToast }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [verificationAttempted, setVerificationAttempted] = useState(false)
  const otpInputRef = useRef()

  const handleSubmit = async (code) => {
    // Prevent multiple submissions
    if (verificationAttempted || isLoading) {
      return
    }

    // Validate code
    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      showToast('Please enter a valid 6-digit code', 'error')
      return
    }

    setIsLoading(true)
    setVerificationAttempted(true)
    
    try {
      console.log('Verifying TOTP code:', code, 'for email:', userEmail)
      
      const response = await apiRequest(API_ENDPOINTS.VERIFY_OTP, {
        method: 'POST',
        body: JSON.stringify({
          email: userEmail,
          token: code
        })
      })

      console.log('TOTP verification successful:', response)
      showToast('TOTP verified successfully!', 'success')
      onVerify(code)

    } catch (error) {
      console.error('TOTP verification failed:', error)
      showToast(error.message || 'Verification failed. Please try again.', 'error')
      
      // Reset for retry
      setVerificationAttempted(false)
      
      // Clear OTP inputs
      if (otpInputRef.current) {
        otpInputRef.current.clearInputs()
      }
      
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div id="totp-verification-screen" className="auth-card active">
      <div className="card-header">
        <button className="back-btn" onClick={onBack}>
          <i className="fas fa-arrow-left"></i>
          Back to Login
        </button>

        <div className="security-icon">
          <i className="fas fa-shield-alt"></i>
        </div>
        <h2>Two-Factor Verification</h2>
        <p>Enter the 6-digit code from your authenticator app</p>
        <p style={{ fontSize: '12px', color: '#ccc', marginTop: '5px' }}>
          Make sure your device time is synchronized
        </p>
      </div>

      <Loader isLoading={isLoading}>
        <form className="auth-form" onSubmit={(e) => {
          e.preventDefault()
          // Prevent form submission from triggering verification
        }}>
          <OtpInput 
            onComplete={handleSubmit} 
            ref={otpInputRef}
          />
          
          <button 
            type="button" 
            className="primary-btn" 
            disabled={isLoading || verificationAttempted}
            onClick={() => {
              // Manual verification trigger if needed
              const inputs = document.querySelectorAll('.otp-input')
              const code = Array.from(inputs).map(input => input.value).join('')
              if (code.length === 6) {
                handleSubmit(code)
              }
            }}
          >
            <i className="fas fa-check"></i>
            Verify & Continue
          </button>

          <div className="form-footer">
            <p>Didn't receive code? <a href="#" onClick={() => showToast('Code resent successfully!', 'success')}>Resend</a></p>
          </div>
        </form>
      </Loader>
    </div>
  )
}

export default TotpVerificationScreen