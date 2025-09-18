// src/components/screens/QrSetupScreen.jsx
const QrSetupScreen = ({ userEmail, qrCodeData, onContinue, showToast }) => {
  return (
    <div id="qr-setup-screen" className="auth-card active">
      <div className="card-header">
        <div className="security-icon">
          <i className="fas fa-qrcode"></i>
        </div>
        <h2>Setup Two-Factor Authentication</h2>
        <p>Scan the QR code with your authenticator app</p>
      </div>

      <div className="qr-section">
        <div className="qr-container">
          {qrCodeData ? (
            <img src={qrCodeData} alt="TOTP QR Code" style={{ width: '200px', height: '200px' }} />
          ) : (
            <div className="qr-placeholder">
              <i className="fas fa-qrcode"></i>
              <p>QR Code will appear here</p>
            </div>
          )}
        </div>
        <p className="qr-instructions">
          Scan this QR code with Google Authenticator or Microsoft Authenticator app
        </p>
      </div>

      <button onClick={onContinue} className="primary-btn">
        <i className="fas fa-arrow-right"></i>
        Continue to Verification
      </button>

      <div className="form-footer">
        <div className="terms-notice">
          By requesting an OTP, you agree to our
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
        </div>
      </div>
    </div>
  )
}

export default QrSetupScreen