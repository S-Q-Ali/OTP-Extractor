import { useCallback, useRef, useState } from "react";
import styles from "../../styles/QrCode/QrCode.module.css";
import Button from "../ui/Button";
import Loader from "../ui/Loader";
import toast from "react-hot-toast";
import { API_ENDPOINTS, apiRequest } from "../../config/api";
import OtpInput from "../ui/OtpInput";
import FormHeader from "../ui/FormHeader";

const QrSetupScreen = ({
  qrCodeData,
  onContinue,
  userEmail,
  onVerify,
  onBack,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  const otpInputRef = useRef();

  console.log("qrcoded data", qrCodeData);

  const handleSubmit = useCallback(
    async (code) => {
      if (verificationAttempted || isLoading) return;

      if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
        toast.error("Please enter a valid 6-digit code");
        return;
      }

      setIsLoading(true);
      setVerificationAttempted(true);

      try {
        const response = await apiRequest(API_ENDPOINTS.VERIFY_OTP, {
          method: "POST",
          body: JSON.stringify({ email: userEmail, token: code }),
        });

        const data = await response.json();

        console.log("data in qrsetup screen", data);

        toast.success("TOTP verified successfully!");
        onVerify(code);
      } catch (error) {
        toast.error(error.message || "Verification failed. Please try again.");
        setVerificationAttempted(false);

        if (otpInputRef.current) {
          otpInputRef.current.clearInputs();
        }
      } finally {
        setIsLoading(false);
      }
    },
    [userEmail, onVerify, verificationAttempted, isLoading]
  );

  return (
    <div id="qr-setup-screen" className={`${styles.authCard} ${styles.active}`}>
      {qrCodeData ? (
        <FormHeader
          icon={"fas fa-qrcode"}
          heading={"Setup Two-Factor Authentication"}
          message={"Scan the QR code with your authenticator app"}
          onBack={onBack}
        />
      ) : (
        <FormHeader
          icon={"fas fa-shield-alt"}
          heading={"Two-Factor Verification"}
          message={"Enter the 6-digit code from your authenticator app"}
          onBack={onBack}
        />
      )}

      {qrCodeData && (
        <div className={styles.qrSection}>
          <div className={styles.qrContainer}>
            <img src={qrCodeData} alt="TOTP QR Code" />
          </div>
          <p className={styles.qrInstructions}>
            Scan this QR code with Google Authenticator or Microsoft
            Authenticator app
          </p>
        </div>
      )}

      <Loader isLoading={isLoading}>
        <div className={styles.authForm}>
          <OtpInput onComplete={handleSubmit} ref={otpInputRef} length={6} />

          {/* <div className={styles.formFooter}>
            <p>
              Didn't receive code?
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toast.success("Code resent successfully!");
                }}
              >
                Resend
              </a>
            </p>
          </div> */}
        </div>
      </Loader>

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
