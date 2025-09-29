"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Eye, CalendarClock, User, Package, IndianRupee, Tag } from "lucide-react";
import ViewEditResourceModal from "./ViewEditResourceModal";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
export default function TransactionDetailsModal({ open, onOpenChange, transactionId }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [tx, setTx] = useState(null);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // FETCH transaction details when opened
  useEffect(() => {
    if (!open || !transactionId) return;

    const fetchTx = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          id, status, created_at, updated_at, resource_id, requester_id, owner_id
        `)
        .eq("id", transactionId)
        .single();

      if (error) {
        console.error("Transaction fetch error:", error);
        setLoading(false);
        return;
      }

      // Then fetch related data separately (like your dashboard does)
      const [resourceResult, requesterResult, ownerResult] = await Promise.all([
        // Fetch resource with category
        supabase
          .from("resources")
          .select("*, categories(name)")
          .eq("id", data.resource_id)
          .single(),
        
        // Fetch requester
        supabase
          .from("users")
          .select("id, name, email, phone")
          .eq("id", data.requester_id)
          .single(),
          
        // Fetch owner
        supabase
          .from("users")
          .select("id, name, email, phone")
          .eq("id", data.owner_id)
          .single()
      ]);

      // Combine the data
      const txWithRelations = {
        ...data,
        resource: resourceResult.data,
        requester: requesterResult.data,
        owner: ownerResult.data
      };

      setTx(txWithRelations);

      setLoading(false);
    };

    fetchTx();
  }, [open, transactionId]);

  useEffect(() => {
    if (!open) {
      setResourceModalOpen(false);
    }
  }, [open]);

  const handleViewResource = async () => {
    if (!tx?.resource?.id || !user?.id) return;
    
    // Check ownership directly from transaction data
    const isOwner = tx.resource.owner_id === user?.id;
    
    if (isOwner) {
      onOpenChange(false);
      setTimeout(() => {
        setResourceModalOpen(true);
      }, 150);
    } else {
      // Close modal and redirect immediately
      onOpenChange(false);
      router.push(`/resources/${tx.resource.id}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-gray-500" />
            Transaction Details
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">Review the transaction and resource information</p>
        </DialogHeader>

        <div className="px-6 pb-6">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-600 py-10">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading transaction...
            </div>
          ) : tx ? (
            <div className="space-y-6">
              {/* Status and timestamps */}
              <div className="flex items-center justify-between">
                <span
                  className={[
                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                    tx.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : tx.status === "declined"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800",
                  ].join(" ")}
                >
                  {tx.status || "pending"}
                </span>
                <div className="text-xs text-gray-500 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <CalendarClock className="w-3.5 h-3.5" />
                    Updated {new Date(tx.updated_at || tx.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    Requester
                  </div>
                  <div className="text-sm text-gray-900">{tx.requester?.name || "Unknown"}</div>
                  <div className="text-xs text-gray-500">{tx.requester?.email}</div>
                  <div className="text-xs text-gray-500">{tx.requester?.phone}</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    Owner
                  </div>
                  <div className="text-sm text-gray-900">{tx.owner?.name || "Unknown"}</div>
                  <div className="text-xs text-gray-500">{tx.owner?.email}</div>
                  <div className="text-xs text-gray-500">{tx.owner?.phone}</div>
                </div>
              </div>

              {/* Resource */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    Resource
                  </div>
                  <a
                    role="button"
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    onClick={handleViewResource}
                  >
                    View resource
                  </a>
                </div>

                <div className="space-y-2">
                  <div className="text-gray-900 font-semibold">{tx.resource?.title}</div>
                  <div className="text-sm text-gray-600">{tx.resource?.description}</div>

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 text-gray-700">
                      <IndianRupee className="w-4 h-4 text-gray-500" />
                      {tx.resource?.price ?? 0}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                      {tx.resource?.type}
                    </span>
                    <span className="inline-flex items-center gap-1 text-gray-700">
                      <Tag className="w-4 h-4 text-gray-500" />
                      {tx.resource?.categories?.name || "Uncategorized"}
                    </span>
                    <span
                      className={[
                        "px-2 py-0.5 rounded text-xs",
                        tx.resource?.availability_status === "available"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800",
                      ].join(" ")}
                    >
                      {tx.resource?.availability_status || "unknown"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Initial message (if any) */}
              {tx.message && (
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Initial message</div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">{tx.message}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-600 py-10">No transaction found.</div>
          )}
        </div>

        <DialogFooter className="px-6 pb-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
      <ViewEditResourceModal
        open={resourceModalOpen}
        onOpenChange={setResourceModalOpen}
        resourceId={tx?.resource?.id}
        currentUserId={user?.id}
        onResourceUpdated={(updatedResource) => {
          setTx(prev => ({ ...prev, resource: updatedResource }));
        }}
      />
    </Dialog>
  );
}
