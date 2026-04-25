import { AppRoutes } from './routes'

function App() {
  const user = localStorage.getItem('user')

  return <AppRoutes />
}

export default App
