// src/components/ui/OtpInput.jsx - FIXED VERSION
import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import styles from "../../styles/OTPInput/OTPInput.module.css"

const OtpInput = forwardRef(({ length = 6, onComplete }, ref) => {
  const inputsRef = useRef([])
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus()
    }
  }, [])

  const handleInputChange = (e, index) => {
    const value = e.target.value
    
    // Only allow digits
    if (!/^\d$/.test(value) && value !== '') return

    if (value) {
      e.target.classList.add(styles.filled)
      
      // Move to next input
      if (index < length - 1) {
        inputsRef.current[index + 1].focus()
      }
    } else {
      e.target.classList.remove(styles.filled)
    }

    // Check if all inputs are filled
    checkCompletion()
  }

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus()
      inputsRef.current[index - 1].value = ''
      inputsRef.current[index - 1].classList.remove(styles.filled)
      setIsComplete(false)
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '')
    
    for (let i = 0; i < Math.min(pasteData.length, length); i++) {
      inputsRef.current[i].value = pasteData[i]
      inputsRef.current[i].classList.add(styles.filled)
      if (i < length - 1) {
        inputsRef.current[i + 1].focus()
      }
    }
    checkCompletion()
  }

  const checkCompletion = () => {
    const code = inputsRef.current.map(input => input.value).join('')
    
    if (code.length === length && !isComplete) {
      setIsComplete(true)
      onComplete(code)
    }
  }

  // Clear all inputs - exposed via ref
  const clearInputs = () => {
    inputsRef.current.forEach(input => {
      if (input) {
        input.value = ''
        input.classList.remove(styles.filled)
      }
    })
    setIsComplete(false)
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus()
    }
  }

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    clearInputs
  }))

  return (
    <div className={styles.otpContainer}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={el => inputsRef.current[index] = el}
          type="text"
          maxLength="1"
          className={styles.otpInput}
          onChange={(e) => handleInputChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          inputMode="numeric"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  )
})

OtpInput.displayName = 'OtpInput'

export default OtpInput