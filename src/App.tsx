import { AppRoutes } from './routes'
import { ErrorBoundary } from './components/shared/error-boundary'

function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  )
}

export default App
