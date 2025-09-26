import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Loader from "../ui/Loader";
import { API_ENDPOINTS, apiRequest } from "../../config/api";
import styles from "../../styles/LoginForm/Login.module.css";
import Button from "../ui/Button";
import FormInputField from "../ui/FormInputField";

const LoginScreen = ({ onLogin, onShowTOTP, onShowQR }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Create form methods once
  const methods = useForm();

  const handleAutoRegister = async (email, password) => {
    const response = await apiRequest(API_ENDPOINTS.REGISTER, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        name: email.split("@")[0],
      }),
    });
    return response;
  };

  const onSubmit = async ({ email, password }) => {
    setIsLoading(true);

    try {
      const response = await apiRequest(API_ENDPOINTS.LOGIN, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (response.requiresOtp) {
        toast.success("Password valid. Please enter your TOTP code");
        onShowTOTP(email);
      } else {
        toast.success("Login successful");
        onLogin(email);
      }
    } catch (error) {
      if (error.message.includes("Invalid email or password")) {
        try {
          const registerResponse = await handleAutoRegister(email, password);
          toast.success("Account created! Please scan the QR code");
          onShowQR(email, registerResponse.qrCode);
        } catch (registerError) {
          toast.error(registerError.message);
        }
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="login-screen" className={`${styles.authCard} ${styles.active}`}>
      <div className={styles.cardHeader}>
        <div className={styles.securityIcon}>
          <i className="fas fa-lock"></i>
        </div>
        <h2>Secure Login Portal</h2>
        <p>Sign in to access your dashboard</p>
      </div>

      <Loader isLoading={isLoading} className={styles.loading}>
        {/* Provide form context */}
        <FormProvider {...methods}>
          <form
            className={styles.authForm}
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            {/* Email Field */}
            <FormInputField
              name="email"
              label="Email Address"
              type="email"
              placeholder="user@example.com"
              icon="fas fa-envelope"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              }}
            />

            {/* Password Field */}
            <FormInputField
              name="password"
              label="Password"
              type="password"
              placeholder="•••••••••"
              icon="fas fa-lock"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 9,
                  message: "Password must be at least 9 characters",
                },
              }}
            />

            <Button
              type="submit"
              className={styles.primaryBtn}
              disabled={isLoading}
            >
              <i className="fas fa-sign-in-alt"></i>
              Sign In / Register
            </Button>

            <div className={styles.formFooter}>
              <a
                href="#"
                className={styles.forgotLink}
                onClick={() => toast.info("Password reset not implemented yet")}
              >
                Forgot your password?
              </a>
              <div className={styles.securityNotice}>
                <i className="fas fa-shield-alt"></i>
                Protected by end-to-end encryption
              </div>
            </div>
          </form>
        </FormProvider>
      </Loader>
    </div>
  );
};

export default LoginScreen;
