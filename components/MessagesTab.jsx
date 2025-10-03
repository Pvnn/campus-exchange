"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Eye, Send } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import TransactionDetailsModal from "@/components/TransactionDetailsModal";
export default function MessagesTab({ messages, user }) {
  const [localMessages, setLocalMessages] = useState(messages)
  const messageEntries = Object.entries(localMessages).sort((a, b) => {
    const lastMsgA = a[1][a[1].length - 1]?.created_at || 0
    const lastMsgB = b[1][b[1].length - 1]?.created_at || 0
    return new Date(lastMsgB) - new Date(lastMsgA) // newest first
  })
  const [selectedTransaction, setSelectedTransaction] = useState(messageEntries[0]?.[0] || null)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const currentUserId = user?.id
  const supabase = createClient()
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionModalId, setTransactionModalId] = useState(null);
  const openTransactionModal = (transactionId) => {
    setTransactionModalId(transactionId);
    setTransactionModalOpen(true);
  };



  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTransaction || sending) return

    setSending(true)
    try {
      // First, get the transaction details to determine receiver
      const { data: transactionData, error: transactionError } = await supabase
        .from("transactions")
        .select(`id, requester_id, owner_id, resources:resource_id (owner_id)`)
        .eq("id", selectedTransaction)
        .single()

      if (transactionError) throw transactionError

      let receiverId
      if (currentUserId === transactionData.requester_id) {
        // Current user is the requester, so receiver is the owner
        receiverId = transactionData.owner_id
      } else if (currentUserId === transactionData.owner_id) {
        // Current user is the owner, so receiver is the requester
        receiverId = transactionData.requester_id
      } else {
        throw new Error("User is not part of this transaction")
      }

      // Insert message into database
      const { data: messageData, error } = await supabase
        .from("messages")
        .insert([
          {
            transaction_id: selectedTransaction,
            sender_id: currentUserId,
            receiver_id: receiverId,
            content: newMessage.trim(),
          },
        ])
        .select(`*, sender:users!sender_id(id, name, email), receiver:users!receiver_id(id, name, email)`)
        .single()

      if (error) throw error

      // Update local state immediately
      setLocalMessages((prev) => ({
        ...prev,
        [selectedTransaction]: [...(prev[selectedTransaction] || []), messageData],
      }))

      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      // You could add a toast notification here
      alert("Failed to send message. Please try again.")
    } finally {
      setSending(false)
    }
  }

  //Enter key handling
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  useEffect(() => {
    if (!selectedTransaction) return

    const channel = supabase
      .channel(`transaction-${selectedTransaction}-messages`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `transaction_id=eq.${selectedTransaction}`,
        },
        (payload) => {
          const newMessage = payload.new

          if (newMessage.sender_id !== currentUserId) {
            setLocalMessages((prev) => ({
              ...prev,
              [selectedTransaction]: [
                ...(prev[selectedTransaction] || []),
                {
                  ...newMessage,
                  sender: { id: newMessage.sender_id },
                },
              ],
            }))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedTransaction, currentUserId])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Conversations</CardTitle>
          <CardDescription>Your transaction messages</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {messageEntries.map(([transactionId, transactionMessages]) => {
              const lastMessage = transactionMessages[transactionMessages.length - 1]
              const isSelected = selectedTransaction === transactionId
              const hasPendingRequest = transactionMessages.some(
                (msg) => msg.type === "request" && msg.status === "pending",
              )
              const resourceName = transactionMessages[0]?.transaction?.resource?.title || "Unknown Resource"
              const transaction = transactionMessages[0]?.transaction
              const isRequester = currentUserId === transaction?.requester_id
              const conversationPartner = isRequester ? transaction?.owner : transaction?.requester
              const partnerName = conversationPartner?.name || conversationPartner?.email || "Unknown"


              return (
                <button
                  key={transactionId}
                  onClick={() => setSelectedTransaction(transactionId)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-l-2 ${
                    isSelected ? "bg-gray-50 border-l-indigo-600" : "border-l-transparent"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-indigo-600 text-white">
                        {partnerName?.charAt(0) || "T"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {resourceName} - {partnerName}
                        </p>
                        <div className="flex items-center space-x-1">
                          <Badge variant="secondary" className="text-xs">
                            {transactionMessages.length}
                          </Badge>
                          {hasPendingRequest && (
                            <Badge className="text-xs bg-yellow-100 text-yellow-800">Pending</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">Transaction #{transactionId}</p>
                      <p className="text-sm text-gray-600 truncate">{lastMessage?.content || "No messages yet"}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {lastMessage ? new Date(lastMessage.created_at).toLocaleDateString() : ""}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}

            {messageEntries.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                <p className="text-gray-600 text-sm">Messages will appear here when you start transactions.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <div className="lg:col-span-2">
        {selectedTransaction ? (
          <Card className="border border-gray-200 shadow-sm bg-white h-full flex flex-col">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Transaction #{selectedTransaction}</CardTitle>
                  <CardDescription>{messages[selectedTransaction]?.length || 0} messages</CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openTransactionModal(selectedTransaction)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Transaction
                </Button>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
              {localMessages[selectedTransaction]?.map((message, index) => {
                const isCurrentUser = message.sender?.id === currentUserId

                return (
                  <div key={message.id}>
                    {message.type === "request" && message.status === "pending" && !isCurrentUser && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-yellow-800">Resource Request</h4>
                            <p className="text-sm text-yellow-700 mt-1">{message.content}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white"
                              onClick={() => {
                                console.log("[v0] Accepting request for message:", message.id)
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => {
                                console.log("[v0] Declining request for message:", message.id)
                              }}
                            >
                              Decline
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
                      <div
                        className={`flex items-end space-x-2 max-w-[70%] ${
                          isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
                        }`}
                      >
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback
                            className={`text-white text-xs ${isCurrentUser ? "bg-indigo-600" : "bg-gray-500"}`}
                          >
                            {message.sender?.name?.charAt(0) || message.sender?.email?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
                          <div
                            className={`rounded-2xl px-4 py-2 max-w-xs break-words ${
                              isCurrentUser
                                ? "bg-indigo-600 text-white rounded-br-sm"
                                : "bg-gray-100 text-gray-900 rounded-bl-sm"
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                          <div
                            className={`flex items-center space-x-1 text-xs text-gray-500 mt-1 ${
                              isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
                            }`}
                          >
                            <span>{message.sender?.name || message.sender?.email || "Unknown"}</span>
                            <span>•</span>
                            <span>
                              {new Date(message.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  onKeyPress={handleKeyPress}
                  rows={2}
                  disabled={sending}
                />
                <Button
                  size="sm"
                  className="rounded-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                >
                  {sending ? (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="border border-gray-200 shadow-sm bg-white h-full flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a transaction from the left to view messages.</p>
            </div>
          </Card>
        )}
      </div>
      <TransactionDetailsModal
        open={transactionModalOpen}
        onOpenChange={setTransactionModalOpen}
        transactionId={transactionModalId}
      />

    </div>
  )
}
