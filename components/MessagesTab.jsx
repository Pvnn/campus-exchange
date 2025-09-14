"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Eye, Send } from "lucide-react"
export default function MessagesTab({ messages, user }) {
  const messageEntries = Object.entries(messages)
  const [selectedTransaction, setSelectedTransaction] = useState(messageEntries[0]?.[0] || null)
  const [newMessage, setNewMessage] = useState("")
  const currentUserId = user?.id;

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
              const resourceName = transactionMessages[0]?.transaction?.resource?.title || "Unknown Resource";
              const senderName = transactionMessages.find((msg) => msg.sender?.id !== currentUserId)?.sender?.name || "Unknown";

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
                        {senderName?.charAt(0) || "T"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {resourceName} - {senderName}
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
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Transaction
                </Button>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
              {messages[selectedTransaction]?.map((message, index) => {
                const isCurrentUser = message.sender?.id === currentUserId;

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
                            {message.sender?.name?.charAt(0) || "U"}
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
                            <span>{message.sender?.name}</span>
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
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      setNewMessage("")
                    }
                  }}
                />
                <Button size="sm" className="rounded-full bg-indigo-600 hover:bg-indigo-700">
                  <Send className="w-4 h-4" />
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
    </div>
  )
}