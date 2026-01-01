import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/http'

export default function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (apiClient.getToken()) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleGetStarted = () => {
    if (apiClient.getToken()) {
      navigate('/dashboard')
    } else {
      navigate('/auth')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl font-bold text-gray-900">Trading Bot</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Build, automate, and execute your trading workflows 
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Button size="lg" onClick={handleGetStarted}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
