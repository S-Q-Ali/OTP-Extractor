// src/components/screens/GhlEmailScreen.jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Loader from '../ui/Loader'
import styles from "../../styles/GHLForm/GHLForm.module.css" 

const GhlEmailScreen = ({ onRequestOTP, otp, onCopyOTP }) => {
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    
    try {
      await onRequestOTP(data.email)
      reset()
    } catch (error) {
      toast.error(error.message || 'Failed to generate OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  return (
    <div id="ghl-email-screen" className={`${styles.authCard} ${styles.active}`}>
      <div className={styles.cardHeader}>
        <div className={styles.securityIcon}>
          <i className="fas fa-lock"></i>
        </div>
        <h2>Secure OTP Verification</h2>
        <p>Enter your details below to receive a one-time password for secure access</p>
      </div>

      <Loader isLoading={isLoading}>
        <form className={styles.authForm} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="ghl-email">GHL Email Address</label>
            <div className={styles.inputField}>
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="ghl-email"
                {...register('email', {
                  required: 'Email is required',
                  validate: {
                    validEmail: (value) => 
                      validateEmail(value) || 'Please enter a valid email address'
                  }
                })}
                placeholder="Enter your GHL email address"
                className={errors.email ? styles.error : ''}
              />
            </div>
            {errors.email && (
              <div className={`${styles.errorMessage} ${styles.show}`}>
                {errors.email.message}
              </div>
            )}

            {/* 👇 OTP shown here */}
            {otp && (
              <div className={styles.otpDisplay}>
                <span>Your OTP: <strong>{otp}</strong></span>
                <button 
                  type="button" 
                  className={styles.copyBtn} 
                  onClick={onCopyOTP}
                >
                  <i className="fas fa-copy"></i> Copy
                </button>
              </div>
            )}
          </div>

          <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
            <i className="fas fa-key"></i>
            Get OTP
          </button>

          <div className={styles.formFooter}>
            <div className={styles.termsNotice}>
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
