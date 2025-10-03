"use client"

import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import DashboardContent from "@/components/DashboardContent"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"

export async function getDashboardData(userId) {
  const supabase = createClient()

  try {
    const [
      resourcesCountResult,
      userInitiatedTxsCountResult,
      othersInitiatedTxsCountResult,
      resourcesResult,
      userInitiatedTxsResult,
      othersInitiatedTxsResult,
      messagesResult,
    ] = await Promise.all([
      // Count of user's own resources
      supabase
        .from("resources")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", userId),

      // Count of transactions user initiated
      supabase
        .from("transactions")
        .select("*", { count: "exact", head: true })
        .eq("requester_id", userId),

      // Count of transactions on user's resources initiated by others
      supabase
        .from("transactions")
        .select("*, resources!inner(owner_id)", { count: "exact", head: true })
        .eq("resources.owner_id", userId)
        .neq("requester_id", userId),

      // Full data for user's resources
      supabase
        .from("resources")
        .select("*, categories(name)")
        .eq("owner_id", userId)
        .order("created_at", { ascending: false }),

      // Transactions user initiated
      supabase
        .from("transactions")
        .select("*, resources(title), initiator:users!requester_id(name), other_party:users!owner_id(name)")
        .eq("requester_id", userId)
        .order("created_at", { ascending: false }),

      // Transactions on user's resources initiated by others
      supabase
        .from("transactions")
        .select("*, resources!inner(title), initiator:users!requester_id(name)")
        .eq("resources.owner_id", userId)
        .neq("requester_id", userId)
        .order("created_at", { ascending: false }),

      //Messages enriched with transaction + resource + participants
      supabase
        .from("messages")
        .select(`
          id,
          content,
          created_at,
          transaction_id,
          sender:users!sender_id(id, name, email),
          receiver:users!receiver_id(id, name, email),
          transaction:transactions (
            id,
            requester_id,
            owner_id,
            requester:users!requester_id(id, name, email),
            owner:users!owner_id(id, name, email),
            resource:resources(id, title, owner_id)
          )
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order("created_at", { ascending: true }),
    ])

    // Handle errors
    if (resourcesCountResult.error) throw resourcesCountResult.error
    if (userInitiatedTxsCountResult.error) throw userInitiatedTxsCountResult.error
    if (othersInitiatedTxsCountResult.error) throw othersInitiatedTxsCountResult.error
    if (resourcesResult.error) throw resourcesResult.error
    if (userInitiatedTxsResult.error) throw userInitiatedTxsResult.error
    if (othersInitiatedTxsResult.error) throw othersInitiatedTxsResult.error
    if (messagesResult.error) throw messagesResult.error

    // Group messages by transaction_id for the MessagesTab
    const messagesByTransaction = {}
    ;(messagesResult.data || []).forEach((message) => {
      const txId = message.transaction_id
      if (!messagesByTransaction[txId]) {
        messagesByTransaction[txId] = []
      }
      messagesByTransaction[txId].push(message)
    })

    return {
      stats: {
        resourcesCount: resourcesCountResult.count || 0,
        userInitiatedTransactions: userInitiatedTxsCountResult.count || 0,
        othersInitiatedTransactions: othersInitiatedTxsCountResult.count || 0,
        totalActiveTransactions: (userInitiatedTxsCountResult.count || 0) + (othersInitiatedTxsCountResult.count || 0),
        unreadMessages: messagesResult.count || 0,
      },
      resources: resourcesResult.data || [],
      userInitiatedTransactions: userInitiatedTxsResult.data || [],
      othersInitiatedTransactions: othersInitiatedTxsResult.data || [],
      messages: messagesResult.data || [],
      messagesByTransaction,
    }
  } catch (error) {
    console.error("Dashboard data fetch error:", error)
    throw error
  }
}

export default function DashboardPage() {
  const { user, loading, initialized } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

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
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <div>Loading dashboard data...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading dashboard: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {dashboardData && <DashboardContent initialData={dashboardData} user={user} />}
    </div>
  )
}
