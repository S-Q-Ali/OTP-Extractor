// src/components/ui/ToastNotification.jsx - FIXED
const ToastNotification = ({ toasts, onRemove }) => {
  const getIconForType = (type) => {
    switch (type) {
      case 'success': return 'check-circle'
      case 'error': return 'exclamation-triangle'
      case 'info': return 'info-circle'
      case 'warning': return 'exclamation-triangle'
      default: return 'info-circle'
    }
  }

  return (
    <div className="message-container">
      {toasts.map(toast => (
        <div key={`${toast.id}-${toast.message}`} className={`message ${toast.type}`}>
          <i className={`fas fa-${getIconForType(toast.type)}`}></i>
          <span>{toast.message}</span>
          <button 
            className="toast-close" 
            onClick={() => onRemove(toast.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              marginLeft: '10px',
              fontSize: '14px'
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastNotification