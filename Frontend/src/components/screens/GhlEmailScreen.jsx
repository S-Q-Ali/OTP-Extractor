import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Loader from "../ui/Loader";
import styles from "../../styles/GHLForm/GHLForm.module.css";
import Button from "../ui/Button";
import FormInputField from "../ui/FormInputField";

const GhlEmailScreen = ({ onRequestOTP, otp, onCopyOTP }) => {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      await onRequestOTP(data.email);
      methods.reset();
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
        <FormProvider {...methods}>
          <form
            className={styles.authForm}
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <FormInputField
              name={"email"}
              label={"Email Address"}
              icon={"fas fa-envelope"}
              type="email"
              id={"ghl-email"}
              placeholder="Enter GHL email (without @gmail.com)"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9+._-]+(@gmail\.com)?$/,
                  message: "Invalid Gmail address",
                },
              }}
            />

            {otp && (
              <div className={styles.otpSection}>
                <div className={styles.otpDisplay}>
                  <span>
                    Your OTP: <strong>{otp}</strong>
                  </span>

                  <Button
                    type={"button"}
                    className={styles.copyBtn}
                    onClick={onCopyOTP}
                  >
                    <i className="fas fa-copy"></i> Copy
                  </Button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              onClick={methods.handleSubmit(onSubmit)}
              className={styles.primaryBtn}
              disabled={isLoading}
            >
              <i className="fas fa-key"></i>
              {otp ? "Fetch New OTP" : "Get OTP from Email"}
            </Button>

            <div className={styles.formFooter}>
              <div className={styles.termsNotice}>
                This will search your Gmail for the latest OTP email
              </div>
            </div>
          </form>
        </FormProvider>
      </Loader>
    </div>
  );
};

export default GhlEmailScreen;
