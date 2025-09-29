"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Package, TrendingUp, Users, Plus, Search} from "lucide-react"
import OverviewTab from '@/components/OverviewTab';
import ResourcesTab from '@/components/ResourcesTab'
import TransactionsTab from "@/components/TransactionsTab"
import MessagesTab from "@/components/MessagesTab"
import AddResourceForm from "./AddResourceForm"

export default function DashboardContent({ initialData, user }) {
  const [dashboardData, setDashboardData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleResourceAdded = (newResource) => {
    setDashboardData(prev => ({
      ...prev,
      resources: [newResource, ...(prev.resources || [])],
      stats: {
        ...prev.stats,
        resourcesCount: (prev.stats?.resourcesCount || 0) + 1
      }
    }));
  };

  // Tab navigation
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "resources", label: "My Resources" },
    { id: "transactions", label: "Transactions" },
    { id: "messages", label: "Messages" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 text-balance">
                Welcome back, {user?.profile?.name || user?.email?.split("@")[0]}!
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl text-pretty">
                Here's what's happening with your Campus Exchange account today.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <Button
                size="sm"
                variant="outline"
                className="cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                <Search className="w-4 h-4 mr-2" />
                Browse Resources
              </Button>
              <Button onClick={() => setIsModalOpen(true)} size="sm" className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border border-gray-200 shadow-sm bg-white">
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

          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Active Deals</p>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData?.stats?.totalActiveTransactions || 0}</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm bg-white">
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

          <Card className="border border-gray-200 shadow-sm bg-white">
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
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resources">My Resources</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab initialData={dashboardData} />
          </TabsContent>

          <TabsContent value="resources">
            <ResourcesTab user={user} resources={dashboardData?.resources || []} />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionsTab
              userInitiated={dashboardData?.userInitiatedTransactions || []}
              othersInitiated={dashboardData?.othersInitiatedTransactions || []}
            />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesTab user={user} messages={dashboardData?.messagesByTransaction || {}} />
          </TabsContent>
        </Tabs>
      </div>
      <AddResourceForm
        user={user}
        onResourceAdded={handleResourceAdded}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      /> 
    </div>
  )
}
