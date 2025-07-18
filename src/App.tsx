import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import ProjectBuilder from './pages/ProjectBuilder'
import { Toaster } from './components/ui/toaster'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectBuilder />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App