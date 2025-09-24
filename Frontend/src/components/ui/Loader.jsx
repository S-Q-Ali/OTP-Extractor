import styles from "../../styles/Loading/Loading.module.css"
// src/components/ui/Loader.jsx
const Loader = ({ isLoading, children }) => {
  return (
    <div className={isLoading ? styles.loading : ''}>
      {children}
    </div>
  )
}

export default Loader