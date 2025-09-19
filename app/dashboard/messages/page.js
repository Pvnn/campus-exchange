"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { getDashboardData } from "@/lib/dashboard-data"
import MessagesTab from "@/components/MessagesTab"

export default function MessagesPage() {
  const { user, loading, initialized } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (initialized && !loading && user) {
      setDataLoading(true)
      setError(null)

      getDashboardData(user.id)
        .then((data) => {
          setDashboardData(data)
        })
        .catch((err) => {
          console.error("Failed to load dashboard data:", err)
          setError(err.message || "Failed to load dashboard data")
        })
        .finally(() => {
          setDataLoading(false)
        })
    }
  }, [initialized, loading, user])

  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading authentication...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Checking authentication...</div>
      </div>
    )
  }

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading messages...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>Error loading messages: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Messages Content */}
      {dashboardData && <MessagesTab user={user} messages={dashboardData.messagesByTransaction || {}} />}
    </div>
  )
}
