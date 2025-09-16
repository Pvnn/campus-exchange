export default function OverviewTab({ initialData }) {
  return (
    <div className="space-y-8">
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Resources</h3>
          <div className="space-y-3">
            {(initialData?.resources || []).slice(0, 3).map((resource) => (
              <div key={resource.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{resource.title}</p>
                  <p className="text-xs text-gray-500">{resource.categories?.name || "Uncategorized"}</p>
                </div>
              </div>
            ))}
            {(!initialData?.resources || initialData.resources.length === 0) && (
              <p className="text-gray-500 text-center py-4">No resources yet</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {/* Show recent transactions */}
            {[...(initialData?.userInitiatedTransactions || []), ...(initialData?.othersInitiatedTransactions || [])]
              .slice(0, 3)
              .map((transaction) => (
                <div key={transaction.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{transaction.resources?.title}</p>
                    <p className="text-xs text-gray-500">Transaction with {transaction.initiator?.name}</p>
                  </div>
                </div>
              ))}
            {!initialData?.userInitiatedTransactions?.length && !initialData?.othersInitiatedTransactions?.length && (
              <p className="text-gray-500 text-center py-4">No activity yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}