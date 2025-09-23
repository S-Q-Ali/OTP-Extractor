// import './App.css'
import "./styles/global.css"
import AppRouter from './components/router/AppRouter'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div className="container">
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--white)',
            color: 'var(--text-color)',
          },
          success: {
            style: {
              background: 'var(--success-color)',
              color: 'var(--white)',
            },
          },
          error: {
            style: {
              background: 'var(--error-color)',
              color: 'var(--white)',
            },
          },
        }}
      />
    </div>
  )
}

export default App