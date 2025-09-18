// src/components/ui/OtpInput.jsx - FIXED VERSION
import { useRef, useEffect, useState } from 'react'

const OtpInput = ({ length = 6, onComplete }) => {
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
      e.target.classList.add('filled')
      
      // Move to next input
      if (index < length - 1) {
        inputsRef.current[index + 1].focus()
      }
    } else {
      e.target.classList.remove('filled')
    }

    // Check if all inputs are filled
    checkCompletion()
  }

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus()
      inputsRef.current[index - 1].value = ''
      inputsRef.current[index - 1].classList.remove('filled')
      setIsComplete(false) // Reset completion state
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '')
    
    for (let i = 0; i < Math.min(pasteData.length, length); i++) {
      inputsRef.current[i].value = pasteData[i]
      inputsRef.current[i].classList.add('filled')
      if (i < length - 1) {
        inputsRef.current[i + 1].focus()
      }
    }
    checkCompletion()
  }

  const checkCompletion = () => {
    const code = inputsRef.current.map(input => input.value).join('')
    
    // Only trigger onComplete if we have a full code and haven't already triggered it
    if (code.length === length && !isComplete) {
      setIsComplete(true) // Prevent multiple triggers
      onComplete(code)
    }
  }

  // Clear all inputs
  const clearInputs = () => {
    inputsRef.current.forEach(input => {
      input.value = ''
      input.classList.remove('filled')
    })
    setIsComplete(false)
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus()
    }
  }

  return (
    <div className="otp-input-container">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={el => inputsRef.current[index] = el}
          type="text"
          maxLength="1"
          className="otp-input"
          onChange={(e) => handleInputChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          inputMode="numeric"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  )
}

export default OtpInput