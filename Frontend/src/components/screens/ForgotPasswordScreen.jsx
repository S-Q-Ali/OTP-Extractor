import { useState } from "react";
import Loader from "../ui/Loader";
import styles from "../../styles/ForgotPassword/Forgot.module.css";
import Button from "../ui/Button";
import { FormProvider, useForm } from "react-hook-form";
import FormInputField from "../ui/FormInputField";

const ForgotPasswordScreen = ({ onRequestCode, onBack, showToast }) => {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm();

  const onSubmit = (data) => {
    console.log("data in handleSubmit", data);
  };

  return (
    <div
      id="forgot-password-screen"
      className={`${styles.authCard}${styles.active}`}
    >
      <div className={styles.cardHeader}>
        <Button className={styles.backBtn} onClick={onBack}>
          <i className="fas fa-arrow-left"></i>
          Back to Login
        </Button>

        <div className={styles.securityIcon}>
          <i className="fas fa-key"></i>
        </div>
        <h2>Reset Password</h2>
        <p>Enter your registered email address</p>
      </div>

      <Loader isLoading={isLoading}>
        <FormProvider {...methods}>
          <form
            className={styles.authForm}
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <FormInputField
              label={"Email Address"}
              type="email"
              id={"forgot-email"}
              name={"email"}
              placeholder={"Enter your registered email"}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9+._-]+(@gmail\.com)?$/,
                  message: "Invalid Gmail address",
                },
              }}
            />

            <Button
              type="submit"
              className={styles.primaryBtn}
              disabled={isLoading}
            >
              <i className="fas fa-paper-plane"></i>
              Send Reset Code
            </Button>
          </form>
        </FormProvider>
      </Loader>
    </div>
  );
};

export default ForgotPasswordScreen;
