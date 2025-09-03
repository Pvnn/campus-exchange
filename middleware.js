import { updateSession } from '@/utils/supabase/middleware'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  // Update the user session using Supabase utilities
  const response = await updateSession(request)

  // Check if user is trying to access protected routes
  const protectedRoutes = ['/dashboard', '/add_resource', '/transactions', '/profile']
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  // If accessing protected route, check authentication
  if (isProtectedRoute) {
    // Create Supabase client to check user
    const { createClient } = await import('./utils/supabase/middleware')
    const { supabase } = createClient(request)
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Redirect to login if not authenticated
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
