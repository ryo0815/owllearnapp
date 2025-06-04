import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // ログインが必要なページのロジック
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // トークンが存在する場合は認証済み
        return !!token
      },
    },
  }
)

// 認証が必要なページパスを指定
export const config = {
  matcher: [
    // 以下のパスには認証が必要
    '/learn/:path*',
    '/lesson/:path*',
    '/lesson-complete/:path*',
    '/profile/:path*',
    '/shop/:path*',
    '/social/:path*',
    '/quests/:path*',
    // 除外するパス（認証不要）
    '/((?!api|_next/static|_next/image|favicon.ico|auth|$).*)',
  ],
} 