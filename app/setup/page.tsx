"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [systemInitialized, setSystemInitialized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if system is already initialized
    const checkSystemStatus = async () => {
      try {
        const response = await fetch("/api/system-status")
        if (response.ok) {
          const data = await response.json()
          if (data.initialized) {
            setSystemInitialized(true)
          }
        }
      } catch (error) {
        console.error("Error checking system status:", error)
      }
    }

    checkSystemStatus()
  }, [])

  const handleSetup = async () => {
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/setup", {
        method: "POST",
      })

      if (response.ok) {
        setSuccess(true)
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          router.push("/")
        }, 3000)
      } else {
        setError("Failed to create sample data")
      }
    } catch (err) {
      setError("An error occurred while setting up data")
    } finally {
      setIsLoading(false)
    }
  }

  if (systemInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">System Already Initialized</CardTitle>
            <CardDescription className="text-center">The system is already set up and ready to use.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <a href="/">Go to Home</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Setup Sample Data</CardTitle>
          <CardDescription className="text-center">
            Create sample users and grievances for testing the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success ? (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-green-700">Setup Complete!</h3>
                <p className="text-sm text-gray-600 mt-2">Sample data has been created successfully.</p>
                <p className="text-sm text-gray-500 mt-1">Redirecting to home page...</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <h4 className="font-semibold mb-2">Test Accounts:</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Admin:</strong>
                    <br />
                    Email: admin@example.com
                    <br />
                    Password: admin123
                  </div>
                  <div>
                    <strong>User:</strong>
                    <br />
                    Email: john@example.com
                    <br />
                    Password: user123
                  </div>
                </div>
              </div>

              <Button asChild className="w-full">
                <a href="/login">Go to Login Now</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                This will create sample users and grievances for testing. This is recommended for first-time setup.
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button onClick={handleSetup} disabled={isLoading} className="w-full">
                {isLoading ? "Creating Sample Data..." : "Create Sample Data"}
              </Button>

              <div className="text-center">
                <Button variant="link" asChild>
                  <a href="/register">Skip and Register Manually</a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
