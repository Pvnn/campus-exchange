import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
export default function TransactionsTab({ userInitiated, othersInitiated }) {
  return (
    <div className="space-y-8">
      {/* Transactions You Started */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Transactions You Started ({userInitiated.length})</h2>
        <div className="space-y-4">
          {userInitiated.map((transaction) => (
            <div key={transaction.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{transaction.resources?.title}</h3>
                  <p className="text-gray-600">With: {transaction.other_party?.name || "Unknown User"}</p>
                  <span
                    className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                      transaction.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : transaction.status === "declined"
                            ? "bg-red-100 text-red-800"
                            : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    {transaction.status || "Pending"}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {userInitiated.length === 0 && <p className="text-gray-500 text-center py-8">No transactions started yet</p>}
        </div>
      </div>

      {/* Requests on Your Resources */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Requests on Your Resources ({othersInitiated.length})</h2>
        <div className="space-y-4">
          {othersInitiated.map((transaction) => (
            <div key={transaction.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{transaction.resources?.title}</h3>
                  <p className="text-gray-600">Request from: {transaction.initiator?.name || "Unknown User"}</p>
                  <span
                    className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                      transaction.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : transaction.status === "declined"
                            ? "bg-red-100 text-red-800"
                            : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    {transaction.status || "Pending"}
                  </span>
                </div>
                <div className="flex space-x-2">
                  {transaction.status === "pending" ? (
                    <>
                      <Button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
                        Accept
                      </Button>
                      <Button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                        Decline
                      </Button>
                    </>
                  ) : (
                    <Button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {othersInitiated.length === 0 && <p className="text-gray-500 text-center py-8">No requests received yet</p>}
        </div>
      </div>
    </div>
  )
}