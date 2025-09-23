// src/components/AppRouter.jsx
import { useState } from 'react'
import toast from 'react-hot-toast'
import LoginScreen from '../screens/LoginScreen'
import QrSetupScreen from '../screens/QrSetupScreen'
import TotpVerificationScreen from '../screens/TotpVerificationScreen'
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen"
import GhlEmailScreen from '../screens/GhlEmailScreen'
import GHLTOTP from '../screens/GHLTOTPScreen'
import { API_ENDPOINTS, apiRequest } from '../../config/api'

const AppRouter = () => {
  const [currentScreen, setCurrentScreen] = useState('login')
  const [userData, setUserData] = useState(null)
  const [currentEmail, setCurrentEmail] = useState('')
  const [qrCodeData, setQrCodeData] = useState('')

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
      toast.loading('Verifying TOTP code...')
      
      const response = await apiRequest(API_ENDPOINTS.VERIFY_OTP, {
        method: 'POST',
        body: JSON.stringify({
          email: currentEmail,
          token: code
        })
      })

      toast.dismiss()
      toast.success('TOTP verified successfully!')
      showScreen('ghlEmail')
      
    } catch (error) {
      toast.dismiss()
      toast.error(error.message || 'TOTP verification failed')
    }
  }

  const handleGHLRequest = async (ghlEmail) => {
    toast.loading('Generating OTP...')
    
    setTimeout(() => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      setUserData(prev => ({ ...prev, ghlEmail, generatedOtp: otp }))
      showScreen('ghlTOTP')
      toast.dismiss()
      toast.success(`Your latest OTP is: ${otp}`)
    }, 1000)
  }

  const copyOTP = () => {
    const otpCode = userData?.generatedOtp || ''
    navigator.clipboard.writeText(otpCode).then(() => {
      toast.success('OTP copied to clipboard!')
    }).catch(() => {
      const textArea = document.createElement('textarea')
      textArea.value = otpCode
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success('OTP copied to clipboard!')
    })
  }

  const generateNewOTP = () => {
    toast.loading('Generating new OTP...')
    setTimeout(() => {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
      setUserData(prev => ({ ...prev, generatedOtp: newOtp }))
      toast.dismiss()
      toast.success(`New OTP generated: ${newOtp}`)
    }, 500)
  }

  const restartFlow = () => {
    setUserData(null)
    setCurrentEmail('')
    setQrCodeData('')
    showScreen('login')
    toast.info('Session reset. Please log in again.')
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen 
            onLogin={handleLogin}
            onShowTOTP={handleShowTOTP}
            onShowQR={handleShowQR}
          />
        )
        case 'forgotpassword':
          <ForgotPasswordScreen />
      case 'qrSetup':
        return (
          <QrSetupScreen 
            userEmail={currentEmail} 
            qrCodeData={qrCodeData}
            onContinue={() => showScreen('totpVerification')}
          />
        )
      case 'totpVerification':
        return (
          <TotpVerificationScreen 
            userEmail={currentEmail}
            onVerify={handleTOTPVerification}
            onBack={() => showScreen('login')}
          />
        )
      case 'ghlEmail':
        return (
          <GhlEmailScreen 
            onRequestOTP={handleGHLRequest}
          />
        )
      case 'ghlTOTP':
        return (
          <GHLTOTP 
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
            onShowTOTP={handleShowTOTP}
            onShowQR={handleShowQR}
          />
        )
    }
  }

  return renderScreen()
}

export default AppRouter