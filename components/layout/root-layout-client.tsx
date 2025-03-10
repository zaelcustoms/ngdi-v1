"use client"

import { Header } from "@/components/layout/header"
import { Banner } from "@/components/layout/banner"
import Footer from "@/components/layout/footer"
import { Sidebar } from "@/components/layout/sidebar"
import { useState } from "react"
import { useSession } from "@/lib/auth-context"

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const { data: session } = useSession()

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onCollapsedChange={setIsSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col">
        <Banner />
        <Header />
        <main className="flex-1 px-8 py-6">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
