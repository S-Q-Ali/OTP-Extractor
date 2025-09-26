import styles from "../../styles/QrCode/QrCode.module.css";
import Button from "../ui/Button";

const QrSetupScreen = ({ qrCodeData, onContinue }) => {
  return (
    <div id="qr-setup-screen" className={`${styles.authCard} ${styles.active}`}>
      <div className={styles.cardHeader}>
        <div className={styles.securityIcon}>
          <i className="fas fa-qrcode"></i>
        </div>
        <h2>Setup Two-Factor Authentication</h2>
        <p>Scan the QR code with your authenticator app</p>
      </div>

      <div className={styles.qrSection}>
        <div className={styles.qrContainer}>
          {qrCodeData ? (
            <img src={qrCodeData} alt="TOTP QR Code" />
          ) : (
            <div className={styles.qrPlaceholder}>
              <i className="fas fa-qrcode"></i>
              <p>QR Code will appear here</p>
            </div>
          )}
        </div>
        <p className={styles.qrInstructions}>
          Scan this QR code with Google Authenticator or Microsoft Authenticator
          app
        </p>
      </div>

      <Button onClick={onContinue} className={styles.primaryBtn}>
        <i className="fas fa-arrow-right"></i>
        Continue to Verification
      </Button>

      <div className={styles.formFooter}>
        <div className={styles.termsNotice}>
          By requesting an OTP, you agree to our
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default QrSetupScreen;
