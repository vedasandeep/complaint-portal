"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function HomePage() {
  const { user } = useAuth()
  const [showSetup, setShowSetup] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if system needs setup
    const checkSystemStatus = async () => {
      try {
        const response = await fetch("/api/system-status")
        if (response.ok) {
          const data = await response.json()
          setShowSetup(!data.initialized)
        }
      } catch (error) {
        console.error("Error checking system status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSystemStatus()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  // Show setup prompt if system is not initialized and user is not logged in
  if (showSetup && !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Online Grievance Redressal System</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Welcome! It looks like this is your first time using the system.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>System Setup</CardTitle>
                <CardDescription>
                  Initialize the system with sample data for testing, or register your own account to get started.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/setup">
                  <Button className="w-full">Initialize with Sample Data</Button>
                </Link>
                <div className="text-center text-sm text-gray-500">or</div>
                <Link href="/register">
                  <Button variant="outline" className="w-full bg-transparent">
                    Register New Account
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Online Grievance Redressal System</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Submit and track your grievances efficiently. Our system ensures your concerns are heard and addressed
            promptly.
          </p>
        </div>

        {user ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>File a New Grievance</CardTitle>
                <CardDescription>Submit a new grievance to the appropriate department</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/file-grievance">
                  <Button className="w-full">File Grievance</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>View My Grievances</CardTitle>
                <CardDescription>Track the status of your submitted grievances</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/my-grievances">
                  <Button variant="outline" className="w-full bg-transparent">
                    View Grievances
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>Please login or register to file and track your grievances</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/login">
                  <Button className="w-full">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="w-full bg-transparent">
                    Register
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
