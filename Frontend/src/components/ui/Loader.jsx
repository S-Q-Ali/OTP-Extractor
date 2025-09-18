// src/components/ui/Loader.jsx
const Loader = ({ isLoading, children }) => {
  return (
    <div className={isLoading ? 'loading' : ''}>
      {children}
    </div>
  )
}

export default Loader