'use client'
import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'

export default function TestDB() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient()
        
        // Test 1: Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
        
        if (categoriesError) {
          setError('Categories Error: ' + categoriesError.message)
          return
        }
        
        setCategories(categoriesData || [])
        
        // Test 2: Check auth status
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        console.log('Auth status:', user ? 'Logged in' : 'Not logged in')
        console.log('Categories found:', categoriesData?.length || 0)
        
      } catch (err) {
        setError('Connection Error: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
    testConnection()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Testing Database Connection...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-white-900">
        Supabase Connection Test
      </h1>
      
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h2 className="text-red-800 font-semibold">❌ Connection Failed</h2>
          <p className="text-red-600 mt-2">{error}</p>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h2 className="text-green-800 font-semibold">✅ Connection Successful!</h2>
          <p className="text-green-600 mt-2">
            Found {categories.length} categories in your database
          </p>
        </div>
      )}

      {categories.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Categories from Database:
          </h2>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li 
                key={category.id} 
                className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded mr-3">
                  {category.id}
                </span>
                <span className="font-medium text-gray-900">
                  {category.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
