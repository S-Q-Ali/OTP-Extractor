// src/App.jsx
import { useState } from 'react'
import './App.css'
import LoginScreen from './components/screens/LoginScreen'
import QrSetupScreen from './components/screens/QrSetupScreen'
import TotpVerificationScreen from './components/screens/TotpVerificationScreen'
import GhlEmailScreen from './components/screens/GhlEmailScreen'
import OtpResultScreen from './components/screens/OtpResultScreen'
import ToastNotification from './components/ui/ToastNotification'
import { API_ENDPOINTS, apiRequest } from './config/api'

function App() {
  const [currentScreen, setCurrentScreen] = useState('login')
  const [userData, setUserData] = useState(null)
  const [toasts, setToasts] = useState([])
  const [currentEmail, setCurrentEmail] = useState('')
  const [qrCodeData, setQrCodeData] = useState('')

// src/App.jsx - Update showToast function
const showToast = (message, type = 'info', duration = 5000) => {
  const id = Date.now() + Math.random(); // Add random number to ensure unique keys
  setToasts(prevToasts => [...prevToasts, { id, message, type }])
  if (duration > 0) {
    setTimeout(() => removeToast(id), duration)
  }
}

  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id))
  }

  const showScreen = (screenName) => setCurrentScreen(screenName)

  const handleLogin = async (email, password) => {
    setCurrentEmail(email)
    setUserData({ email, password })
    showScreen('totpVerification')
  }

  const handleShowTOTP = (email) => {
    setCurrentEmail(email)
    showScreen('totpVerification')
  }

  const handleShowQR = (email, qrCode) => {
    setCurrentEmail(email)
    setQrCodeData(qrCode)
    showScreen('qrSetup')
  }

  const handleTOTPVerification = async (code) => {
    try {
      showToast('Verifying TOTP code...', 'info')
      
      const response = await apiRequest(API_ENDPOINTS.VERIFY_OTP, {
        method: 'POST',
        body: JSON.stringify({
          email: currentEmail,
          token: code
        })
      })

      showToast('TOTP verified successfully!', 'success')
      showScreen('ghlEmail')
      
    } catch (error) {
      showToast(error.message || 'TOTP verification failed', 'error')
    }
  }

  const handleGHLRequest = async (ghlEmail) => {
    showToast('Generating OTP...', 'info')
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    setUserData(prev => ({ ...prev, ghlEmail, generatedOtp: otp }))
    showScreen('otpResult')
    showToast(`Your latest OTP is: ${otp}`, 'success')
  }

  const copyOTP = () => {
    const otpCode = userData?.generatedOtp || ''
    navigator.clipboard.writeText(otpCode).then(() => {
      showToast('OTP copied to clipboard!', 'success')
    }).catch(() => {
      const textArea = document.createElement('textarea')
      textArea.value = otpCode
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      showToast('OTP copied to clipboard!', 'success')
    })
  }

  const generateNewOTP = () => {
    showToast('Generating new OTP...', 'info')
    setTimeout(() => {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
      setUserData(prev => ({ ...prev, generatedOtp: newOtp }))
      showToast(`New OTP generated: ${newOtp}`, 'success')
    }, 500)
  }

  const restartFlow = () => {
    setUserData(null)
    setCurrentEmail('')
    setQrCodeData('')
    showScreen('login')
    showToast('Session reset. Please log in again.', 'info')
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen 
            onLogin={handleLogin} 
            onShowForgotPassword={() => showToast('Password reset not implemented yet', 'info')} 
            onShowTOTP={handleShowTOTP}
            onShowQR={handleShowQR}
            showToast={showToast} 
          />
        )
      case 'qrSetup':
        return (
          <QrSetupScreen 
            userEmail={currentEmail} 
            qrCodeData={qrCodeData}
            onContinue={() => showScreen('totpVerification')} 
            showToast={showToast}
          />
        )
      case 'totpVerification':
        return (
          <TotpVerificationScreen 
            userEmail={currentEmail}
            onVerify={handleTOTPVerification} 
            onBack={() => showScreen('login')} 
            showToast={showToast} 
          />
        )
      case 'ghlEmail':
        return (
          <GhlEmailScreen 
            onRequestOTP={handleGHLRequest} 
            showToast={showToast} 
          />
        )
      case 'otpResult':
        return (
          <OtpResultScreen 
            userEmail={userData?.ghlEmail} 
            otpCode={userData?.generatedOtp} 
            onCopyOTP={copyOTP} 
            onGenerateNewOTP={generateNewOTP} 
            onRestart={restartFlow}
          />
        )
      default:
        return (
          <LoginScreen 
            onLogin={handleLogin} 
            onShowForgotPassword={() => showToast('Password reset not implemented yet', 'info')} 
            onShowTOTP={handleShowTOTP}
            onShowQR={handleShowQR}
            showToast={showToast}
          />
        )
    }
  }

  return (
    <div className="container">
      {renderScreen()}
      <ToastNotification toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default App