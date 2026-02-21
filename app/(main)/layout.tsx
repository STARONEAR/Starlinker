import { BottomNav } from '@/components/layout/BottomNav'
import { TopBar } from '@/components/layout/TopBar'
import { FloatingAI } from '@/components/layout/FloatingAI'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1 pb-20">
        {children}
      </main>
      <BottomNav />
      <FloatingAI />
    </div>
  )
}
