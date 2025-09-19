"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { getDashboardData } from "@/lib/dashboard-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Package, TrendingUp, Users, Plus, Search } from "lucide-react"
import Link from "next/link"
import OverviewTab from "@/components/OverviewTab"

export default function DashboardPage() {
  const { user, loading, initialized } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (initialized && !loading && user) {
      console.log("Loading dashboard data for user:", user.id)
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
        <div>Loading dashboard data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>Error loading dashboard: {error}</p>
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 text-balance">
            Welcome back, {user?.profile?.name || user?.email?.split("@")[0]}!
          </h1>
          <p className="text-lg text-gray-700 text-pretty">
            Here's what's happening with your Campus Exchange account today.
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-3">
          <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent">
            <Search className="w-4 h-4 mr-2" />
            Browse Resources
          </Button>
          <Link href="/dashboard/resources">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Resource
            </Button>
          </Link>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/dashboard/resources">
          <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Your Resources</p>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData?.stats?.resourcesCount || 0}</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <Package className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/transactions">
          <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Active Deals</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData?.stats?.totalActiveTransactions || 0}
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/messages">
          <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Messages</p>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData?.stats?.unreadMessages || 0}</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <MessageCircle className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/transactions">
          <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">New Requests</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData?.stats?.othersInitiatedTransactions || 0}
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Overview Content */}
      {dashboardData && <OverviewTab initialData={dashboardData} />}
    </div>
  )
}
