import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export const createClient = (request) => {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          // Update cookies for both request and response
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          // Remove cookies from both request and response
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  return { supabase, response }
}

export const updateSession = async (request) => {
  try {
    const { supabase, response } = createClient(request)

    // This refreshes the session if expired - CRITICAL for auth
    await supabase.auth.getUser()

    return response
  } catch (e) {
    // If Supabase client creation fails
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}
