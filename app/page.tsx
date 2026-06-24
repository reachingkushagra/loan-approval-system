'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Landmark,
  Lock,
  Mail,
  ShieldCheck,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const highlights = [
  {
    icon: Clock,
    title: 'Decisions in minutes',
    body: 'Automated underwriting gives most applicants an answer the same day.',
  },
  {
    icon: ShieldCheck,
    title: 'Bank-grade security',
    body: '256-bit encryption and SOC 2 Type II compliant infrastructure.',
  },
  {
    icon: TrendingUp,
    title: 'Rates from 5.8% APR',
    body: 'Competitive fixed rates across personal, auto, home, and business.',
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => router.push('/dashboard'), 600)
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand / marketing panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Landmark className="size-5" />
          </span>
          <span className="text-lg font-semibold">Bright Bridge</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-pretty text-3xl font-semibold leading-tight">
            Lending, modernized for borrowers and officers alike.
          </h1>
          <p className="mt-3 text-sidebar-foreground/70">
            One platform to apply, track, review, and approve loans — with
            transparency at every step.
          </p>

          <div className="mt-8 flex flex-col gap-5">
            {highlights.map((h) => (
              <div key={h.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-primary">
                  <h.icon className="size-4.5" />
                </span>
                <div>
                  <p className="text-sm font-medium">{h.title}</p>
                  <p className="text-sm text-sidebar-foreground/60">{h.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-sidebar-foreground/50">
          © 2025 BrightBridge Lending, Inc. NMLS #482193. Equal Housing Lender.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Landmark className="size-5" />
            </span>
            <span className="text-lg font-semibold">BrightBridge</span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage your loans and applications.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  defaultValue="amara.okafor@example.com"
                  placeholder="you@example.com"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  required
                  defaultValue="password"
                  placeholder="••••••••"
                  className="pl-9"
                />
              </div>
            </div>

            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          <Button
            variant="outline"
            className="w-full"
            render={<Link href="/dashboard" />}
          >
            Continue as guest demo
          </Button>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            New to BrightBridge?{' '}
            <Link
              href="/apply"
              className="font-medium text-primary hover:underline"
            >
              Apply for a loan
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
