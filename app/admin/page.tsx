"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Grievance {
  id: string
  title: string
  description: string
  department: string
  status: "Pending" | "In Progress" | "Resolved"
  submittedAt: string
  userId: string
  userName: string
  userEmail: string
  adminResponse?: string
  respondedAt?: string
}

export default function AdminDashboard() {
  const [grievances, setGrievances] = useState<Grievance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null)
  const [response, setResponse] = useState("")
  const [newStatus, setNewStatus] = useState<"Pending" | "In Progress" | "Resolved">("Pending")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "admin") {
      router.push("/")
      return
    }

    fetchAllGrievances()
  }, [user, router])

  const fetchAllGrievances = async () => {
    try {
      const response = await fetch("/api/admin/grievances")
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

  const handleRespondToGrievance = async () => {
    if (!selectedGrievance || !response.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/admin/grievances/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grievanceId: selectedGrievance.id,
          response: response.trim(),
          status: newStatus,
        }),
      })

      if (res.ok) {
        await fetchAllGrievances()
        setSelectedGrievance(null)
        setResponse("")
        setNewStatus("Pending")
      }
    } catch (error) {
      console.error("Error responding to grievance:", error)
    } finally {
      setIsSubmitting(false)
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

  const getStatusCount = (status: string) => {
    return grievances.filter((g) => g.status === status).length
  }

  if (!user || user.role !== "admin") {
    return <div>Access denied. Admin privileges required.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage and respond to user grievances</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">{grievances.length}</div>
              <div className="text-sm text-gray-600">Total Grievances</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-600">{getStatusCount("Pending")}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">{getStatusCount("In Progress")}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{getStatusCount("Resolved")}</div>
              <div className="text-sm text-gray-600">Resolved</div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Grievances List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">All Grievances</h2>
              {grievances.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-600">No grievances found.</p>
                  </CardContent>
                </Card>
              ) : (
                grievances.map((grievance) => (
                  <Card
                    key={grievance.id}
                    className={`cursor-pointer transition-colors ${
                      selectedGrievance?.id === grievance.id ? "ring-2 ring-blue-500" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setSelectedGrievance(grievance)
                      setNewStatus(grievance.status)
                      setResponse(grievance.adminResponse || "")
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{grievance.title}</CardTitle>
                          <CardDescription>
                            By: {grievance.userName} ({grievance.userEmail})
                            <br />
                            Department: {grievance.department} • {new Date(grievance.submittedAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(grievance.status)}>{grievance.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-700 text-sm line-clamp-2">{grievance.description}</p>
                      {grievance.adminResponse && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                          <strong>Admin Response:</strong> {grievance.adminResponse}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Response Panel */}
            <div className="lg:sticky lg:top-4">
              {selectedGrievance ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Respond to Grievance</CardTitle>
                    <CardDescription>Responding to: {selectedGrievance.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Grievance Details:</h4>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <p>
                          <strong>User:</strong> {selectedGrievance.userName}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedGrievance.userEmail}
                        </p>
                        <p>
                          <strong>Department:</strong> {selectedGrievance.department}
                        </p>
                        <p>
                          <strong>Submitted:</strong> {new Date(selectedGrievance.submittedAt).toLocaleString()}
                        </p>
                        <p className="mt-2">
                          <strong>Description:</strong>
                        </p>
                        <p>{selectedGrievance.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Update Status</Label>
                      <Select
                        value={newStatus}
                        onValueChange={(value: "Pending" | "In Progress" | "Resolved") => setNewStatus(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="response">Admin Response</Label>
                      <Textarea
                        id="response"
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Enter your response to the user..."
                        className="min-h-[120px]"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleRespondToGrievance}
                        disabled={isSubmitting || !response.trim()}
                        className="flex-1"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Response"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedGrievance(null)
                          setResponse("")
                          setNewStatus("Pending")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-600">Select a grievance to respond</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
