import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Loader from "../ui/Loader";
import { API_ENDPOINTS, apiRequest } from "../../config/api";
import styles from "../../styles/LoginForm/Login.module.css"; // Correct import

const LoginScreen = ({ onLogin, onShowTOTP, onShowQR }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
        <form className={styles.authForm} onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <div className={styles.inputField}>
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                placeholder="user@example.com"
                className={errors.email ? styles.error : ""}
              />
            </div>
            {errors.email && (
              <div className={`${styles.errorMessage} ${styles.show}`}>
                {errors.email.message}
              </div>
            )}
          </div>

          {/* Password */}
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputField}>
              <i className="fas fa-lock"></i>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 9,
                    message: "Password must be at least 9 characters",
                  },
                })}
                placeholder="••••••••••"
                className={errors.password ? styles.error : ""}
              />
            </div>
            {errors.password && (
              <div className={`${styles.errorMessage} ${styles.show}`}>
                {errors.password.message}
              </div>
            )}
          </div>

          <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
            <i className="fas fa-sign-in-alt"></i>
            Sign In / Register
          </button>

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
      </Loader>
    </div>
  );
};

export default LoginScreen;