import './App.css'
import Routes from './Pages/Router'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ContextProvider } from './Components/SocketContext'
import { ToastProvider } from './Components/Toast/ToastContex'

function App() {
  return (
    <ToastProvider>
      <ContextProvider>
        <Routes />
      </ContextProvider>
    </ToastProvider>
  )
}

export default App
