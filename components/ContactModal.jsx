"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageCircle, CheckCircle2 } from "lucide-react";

export default function ContactModal({
  isOpen,
  onClose,
  resource,
  currentUser,
  onTransactionCreated,
}) {
  const supabase = createClient();
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const maxChars = 250;

  const handleSend = async () => {
    if (!message.trim()) {
      setErrorMessage("Message cannot be empty");
      return;
    }

    if (!currentUser?.id) {
      setErrorMessage("You must be logged in to send a message.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      // 1. Check for existing transaction
      let { data: transaction, error: transError } = await supabase
        .from("transactions")
        .select("*")
        .eq("resource_id", resource.id)
        .eq("requester_id", currentUser.id)
        .eq("owner_id", resource.owner_id)
        .single();

      if (transError && transError.code === "PGRST116") {
        // No transaction exists → create a new one
        const { data: newTransaction, error: createError } = await supabase
          .from("transactions")
          .insert([
            {
              resource_id: resource.id,
              requester_id: currentUser.id,
              owner_id: resource.owner_id,
              status: "pending",
            },
          ])
          .select()
          .single();

        if (createError) throw createError;
        transaction = newTransaction;

        // Notify parent that transaction was created
        if (onTransactionCreated) onTransactionCreated();
      } else if (transError) {
        throw transError;
      }

      // 2. Insert message
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert([
          {
            transaction_id: transaction.id,
            sender_id: currentUser.id,
            receiver_id: resource.owner_id,
            content: message.trim(),
          },
        ])
        .select()
        .single();

      if (messageError) throw messageError;

      setSuccessMessage("Message sent to owner");
      setMessage("");

      // Auto-close after 2 seconds
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Failed to send message:", err);
      setErrorMessage(`Failed to send message. ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[540px] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-gray-500" />
            Contact Owner
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">Send a message about this resource</p>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div className="space-y-4">
            {/* Resource Info */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="text-sm font-semibold text-gray-900 mb-1">{resource.title}</div>
              <div className="text-sm text-gray-600">{resource.description}</div>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Your message</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={maxChars}
                placeholder="Write your message to the owner..."
                className="min-h-[120px] resize-none"
                disabled={loading || successMessage}
              />
              <div className="text-right text-xs text-gray-500">
                {message.length}/{maxChars}
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{successMessage}</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={handleSend}
            disabled={loading || successMessage}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
