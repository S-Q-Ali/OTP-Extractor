function Button({ children, onClick, className, styles, type, isLoading }) {
  return (
    <button
      disabled={isLoading || false}
      type={type}
      onClick={onClick}
      className={className}
      style={styles}
    >
      {children}
    </button>
  );
}

export default Button;
