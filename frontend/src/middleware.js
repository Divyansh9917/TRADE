import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/trade(.*)'])

// 1. We must make this callback 'async'
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // 2. We await auth.protect() instead of calling auth().protect()
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}