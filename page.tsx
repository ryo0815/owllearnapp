"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // まだロード中

    if (!session) {
      // 未ログインの場合はサインインページへ
      router.push("/auth/signin")
    } else {
      // ログイン済みの場合は学習ページへ
      router.push("/learn")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-600 flex items-center justify-center">
        <Card className="p-8 bg-white rounded-3xl shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-xl font-semibold text-gray-700">OwlLearn を読み込み中...</h2>
            <p className="text-gray-500 mt-2">しばらくお待ちください</p>
          </div>
        </Card>
      </div>
    )
  }

  // ロード中またはリダイレクト中の表示
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-600 flex items-center justify-center">
      <Card className="p-8 bg-white rounded-3xl shadow-2xl">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">🦉</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">OwlLearn</h1>
          <p className="text-gray-600">ページを準備中...</p>
        </div>
      </Card>
    </div>
  )
}
