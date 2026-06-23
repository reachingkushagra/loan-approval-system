import type { ReactNode } from 'react'
import { Bell, Search } from 'lucide-react'
import { AppSidebar } from '@/components/app-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export function DashboardShell({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur md:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-5" />
          <div className="relative hidden max-w-xs flex-1 sm:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search applications…"
              className="h-9 bg-secondary/60 pl-8"
            />
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="size-4.5" />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-destructive" />
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-pretty text-2xl font-semibold tracking-tight">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2">{actions}</div>
            )}
          </div>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
