import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  gradient?: string
  icon?: LucideIcon
}

export function PageHeader({
  title,
  subtitle,
  gradient = 'from-emerald-600 to-teal-600',
  icon: Icon,
}: PageHeaderProps) {
  return (
    <header className={cn('relative overflow-hidden bg-gradient-to-r text-white shadow-sm', gradient)}>
      <div className="pattern-overlay pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center gap-4 p-6 md:p-8">
        <Link href="/" aria-label="Back">
          <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/20">
            <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
          </Button>
        </Link>

        {Icon ? (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-inset ring-white/25">
            <Icon className="h-6 w-6" />
          </span>
        ) : null}

        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          {subtitle ? <p className="truncate text-sm text-white/80">{subtitle}</p> : null}
        </div>
      </div>

      <div className="relative z-10 h-px w-full bg-white/15" aria-hidden="true" />
    </header>
  )
}
