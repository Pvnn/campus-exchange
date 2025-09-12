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
  const { user, loading, initialized } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Track component mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // FIXED: Wait for mount AND auth initialization before redirecting
  useEffect(() => {
    if (isMounted && initialized && !loading && !user) {
      console.log('Redirecting to login - no user found');
      router.replace('/login');
    }
  }, [isMounted, initialized, loading, user, router]);

  // FIXED: Wait for auth initialization before loading data
  useEffect(() => {
    if (isMounted && initialized && !loading && user) {
      console.log('Loading dashboard data for user:', user.id);
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
  }, [isMounted, initialized, loading, user]);

  // Show loading while auth is initializing OR component not mounted
  if (!isMounted || !initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading authentication...</div>
      </div>
    );
  }

  // Show redirect message (briefly visible)
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Redirecting to login...</div>
      </div>
    );
  }

  // Rest of your component remains the same...
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {dashboardData && (
        <DashboardContent initialData={dashboardData} user={user} />
      )}
    </div>
  );
}