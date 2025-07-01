"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Grievance {
  id: string
  title: string
  description: string
  department: string
  status: "Pending" | "In Progress" | "Resolved"
  submittedAt: string
  userId: string
  adminResponse?: string
  respondedAt?: string
}

export default function MyGrievancesPage() {
  const [grievances, setGrievances] = useState<Grievance[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    fetchGrievances()
  }, [user, router])

  const fetchGrievances = async () => {
    try {
      const response = await fetch(`/api/grievances?userId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setGrievances(data.grievances)
      }
    } catch (error) {
      console.error("Error fetching grievances:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Grievances</h1>
            <p className="text-gray-600 mt-2">Track the status of your submitted grievances</p>
          </div>
          <Link href="/file-grievance">
            <Button>File New Grievance</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : grievances.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Grievances Found</h3>
              <p className="text-gray-600 mb-4">You haven't submitted any grievances yet.</p>
              <Link href="/file-grievance">
                <Button>File Your First Grievance</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {grievances.map((grievance) => (
              <Card key={grievance.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{grievance.title}</CardTitle>
                      <CardDescription>
                        Department: {grievance.department} • Submitted:{" "}
                        {new Date(grievance.submittedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(grievance.status)}>{grievance.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{grievance.description}</p>
                  {grievance.adminResponse && (
                    <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                      <h4 className="font-semibold text-blue-900 mb-1">Admin Response:</h4>
                      <p className="text-blue-800 text-sm">{grievance.adminResponse}</p>
                      {grievance.respondedAt && (
                        <p className="text-blue-600 text-xs mt-1">
                          Responded on: {new Date(grievance.respondedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
