"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ContactModal({
  isOpen,
  onClose,
  resource,
  currentUser,
  onTransactionCreated, // 👈 new callback prop
}) {
  const supabase = createClient();
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const maxChars = 250;

  if (!isOpen) return null;

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
    <div className="fixed inset-0 min-h-screen bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
        <h2 className="text-xl font-bold mb-4">
          Contact about: {resource.title}
        </h2>
        <p className="mb-2 text-gray-700">{resource.description}</p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={maxChars}
          placeholder="Write your message..."
          className="w-full p-2 border rounded-lg mb-2"
          disabled={loading || successMessage}
        />

        <div className="text-right text-sm text-gray-500 mb-2">
          {message.length}/{maxChars}
        </div>

        {errorMessage && (
          <div className="text-red-600 text-sm mb-2">{errorMessage}</div>
        )}

        {successMessage && (
          <div className="flex items-center justify-center gap-2 bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded mb-4 shadow-sm animate-fadeIn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8.364 8.364a1 1 0 01-1.414 0L3.293 11.707a1 1 0 011.414-1.414L8 13.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-300 hover:bg-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="px-9 py-2 rounded-xl bg-indigo-700 text-white hover:bg-indigo-600"
            disabled={loading || successMessage}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
