import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import { queryClient } from './lib/query-client'
import { startSessionSync } from './lib/session-sync'
import './index.css'

// Reset per-user persisted flow state (onboarding wizard + quiz session) whenever
// the signed-in user changes, so a shared browser doesn't leak it across accounts.
startSessionSync()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
