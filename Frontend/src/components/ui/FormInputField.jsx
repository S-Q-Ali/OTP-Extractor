import { useFormContext } from "react-hook-form";
import styles from "../../styles/GHLForm/GHLForm.module.css";

const FormInputField = ({
  name,
  label,
  type = "text",
  placeholder,
  rules,
  icon,
  id,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles.formGroup}>
      {label && <label htmlFor={name}>{label}</label>}

      <div className={styles.inputField}>
        {icon && <i className={icon}></i>}
        <input
          id={id || name}
          type={type}
          placeholder={placeholder}
          {...register(name, rules)}
          className={errors[name] ? styles.error : ""}
        />
      </div>

      {errors[name] && (
        <div className={`${styles.errorMessage} ${styles.show}`}>
          {errors[name].message}
        </div>
      )}
    </div>
  );
};

export default FormInputField;
