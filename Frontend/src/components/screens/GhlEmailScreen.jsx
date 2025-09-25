// src/components/screens/GhlEmailScreen.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Loader from "../ui/Loader";
import styles from "../../styles/GHLForm/GHLForm.module.css";

const GhlEmailScreen = ({ onRequestOTP, otp, onCopyOTP, onRefreshOTP }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const fullEmail = `${data.email}@gmail.com`;
      await onRequestOTP(data.email);
      reset();
    } catch (error) {
      toast.error(error.message || "Failed to fetch OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="ghl-email-screen"
      className={`${styles.authCard} ${styles.active}`}
    >
      <div className={styles.cardHeader}>
        <div className={styles.securityIcon}>
          <i className="fas fa-lock"></i>
        </div>
        <h2>Secure OTP Verification</h2>
        <p>Enter your GHL email to fetch OTP from your inbox</p>
      </div>

      <Loader isLoading={isLoading}>
        <form className={styles.authForm} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="ghl-email">GHL Email Address</label>
            <div className={styles.inputField}>
              <i className="fas fa-envelope"></i>
              <input
                type="text"
                id="ghl-email"
                {...register("email", {
                  required: "Email is required",
                  validate: {
                    validPrefix: (value) =>
                      /^[a-zA-Z0-9+._-]+$/.test(value) ||
                      "Enter Without @gmail.com",
                  },
                })}
                placeholder="Enter GHL email (without @gmail.com)"
                className={errors.email ? styles.error : ""}
              />
            </div>
            {errors.email && (
              <div className={`${styles.errorMessage} ${styles.show}`}>
                {errors.email.message}
              </div>
            )}

            {/* OTP Display Section */}
            {otp && (
              <div className={styles.otpSection}>
                <div className={styles.otpDisplay}>
                  <span>
                    Your OTP: <strong>{otp}</strong>
                  </span>
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={onCopyOTP}
                  >
                    <i className="fas fa-copy"></i> Copy
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className={styles.primaryBtn}
            disabled={isLoading}
          >
            <i className="fas fa-key"></i>
            {otp ? "Fetch New OTP" : "Get OTP from Email"}
          </button>

          <div className={styles.formFooter}>
            <div className={styles.termsNotice}>
              This will search your Gmail for the latest OTP email
            </div>
          </div>
        </form>
      </Loader>
    </div>
  );
};

export default GhlEmailScreen;
