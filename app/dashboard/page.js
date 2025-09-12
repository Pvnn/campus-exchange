"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import DashboardContent from '@/components/DashboardContent'
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from "react";

async function getDashboardData(userId) {
  const supabase = createClient();
  
  try {
    const [
      resourcesCountResult,
      userInitiatedTxsCountResult,
      othersInitiatedTxsCountResult,
      resourcesResult,
      userInitiatedTxsResult,
      othersInitiatedTxsResult,
      messagesResult
    ] = await Promise.all([
      // Count queries
      supabase
        .from('resources')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', userId),
      
      // Count user initiated transactions
      supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('requester_id', userId),
      
      // Count transactions on user's resources initiated by others
      supabase
        .from('transactions')
        .select('*, resources!inner(owner_id)', { count: 'exact', head: true })
        .eq('resources.owner_id', userId)
        .neq('requester_id', userId),

      // Data queries
      supabase
        .from('resources')
        .select('*, categories(name)')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false }),

      // User initiated transactions
      supabase
        .from('transactions')
        .select('*, resources(title), initiator:users!requester_id(name), other_party:users!owner_id(name)')
        .eq('requester_id', userId)
        .order('created_at', { ascending: false }),

      // Transactions on user's resources initiated by others
      supabase
        .from('transactions')
        .select('*, resources!inner(title), initiator:users!requester_id(name)')
        .eq('resources.owner_id', userId)
        .neq('requester_id', userId)
        .order('created_at', { ascending: false }),

      // Messages where user is sender OR receiver, grouped by transaction for chat
      supabase
        .from('messages')
        .select('*, sender:users!sender_id(name), receiver:users!receiver_id(name), transactions(id)')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('transaction_id, created_at', { ascending: true })
    ]);

    // Check for errors
    if (resourcesCountResult.error) throw resourcesCountResult.error;
    if (userInitiatedTxsCountResult.error) throw userInitiatedTxsCountResult.error;
    if (othersInitiatedTxsCountResult.error) throw othersInitiatedTxsCountResult.error;
    if (resourcesResult.error) throw resourcesResult.error;
    if (userInitiatedTxsResult.error) throw userInitiatedTxsResult.error;
    if (othersInitiatedTxsResult.error) throw othersInitiatedTxsResult.error;
    if (messagesResult.error) throw messagesResult.error;

    // Group messages by transaction_id for chat display
    const messagesByTransaction = {};
    (messagesResult.data || []).forEach(message => {
      const txId = message.transaction_id;
      if (!messagesByTransaction[txId]) {
        messagesByTransaction[txId] = [];
      }
      messagesByTransaction[txId].push(message);
    });

    return {
      stats: {
        resourcesCount: resourcesCountResult.count || 0,
        userInitiatedTransactions: userInitiatedTxsCountResult.count || 0,
        othersInitiatedTransactions: othersInitiatedTxsCountResult.count || 0,
        totalActiveTransactions: (userInitiatedTxsCountResult.count || 0) + (othersInitiatedTxsCountResult.count || 0),
        unreadMessages: messagesResult.count || 0
      },
      resources: resourcesResult.data || [],
      userInitiatedTransactions: userInitiatedTxsResult.data || [],
      othersInitiatedTransactions: othersInitiatedTxsResult.data || [],
      messages: messagesResult.data || [],
      messagesByTransaction: messagesByTransaction
    };
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    throw error;
  }
}


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setDataLoading(true);
      setError(null);
      
      getDashboardData(user.id)
        .then(data => {
          setDashboardData(data);
        })
        .catch(err => {
          console.error('Failed to load dashboard data:', err);
          setError(err.message || 'Failed to load dashboard data');
        })
        .finally(() => {
          setDataLoading(false);
        });
    }
  }, [user]);

  // Handle authentication loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading authentication...</div>
      </div>
    );
  }

  // Handle redirect for unauthenticated users
  if (!user) {
    router.push('/login');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Redirecting to login...</div>
      </div>
    );
  }

  // Handle data loading
  if (dataLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <div>Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  // Handle errors
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
    );
  }

  // Handle missing data
  if (!dashboardData) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div>No dashboard data available</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <DashboardContent 
        initialData={dashboardData} 
        user={user}
      />
    </div>
  );
}
