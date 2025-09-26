import styles from "../../styles/Form/FormHeader.module.css";
import Button from "./Button";

function FormHeader({ onBack, icon, heading, message }) {
  return (
    <div className={styles.cardHeader}>
      {onBack && (
        <Button type="button" className={styles.backBtn} onClick={onBack}>
          <i className="fas fa-arrow-left"></i>
          Back to Login
        </Button>
      )}

      <div className={styles.securityIcon}>
        <i className={icon}></i>
      </div>
      <h2>{heading}</h2>
      <p>{message}</p>
    </div>
  );
}

export default FormHeader;
