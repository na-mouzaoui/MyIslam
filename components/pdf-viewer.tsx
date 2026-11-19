'use client'

import { useEffect, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Menu,
  Moon,
  Share2,
  Sun,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PDFViewerProps {
  title: string
  totalPages: number
  onClose: () => void
}

/** Stable placeholder line widths — Math.random() would reshuffle on every render. */
const LINE_WIDTHS = [92, 78, 88, 64, 95, 72, 84, 90]
const QUICK_JUMP_STEP = 10

export function PDFViewer({ title, totalPages, onClose }: PDFViewerProps) {
  const { t, language } = useLanguage()
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    if (shareState === 'idle') return
    const timeout = setTimeout(() => setShareState('idle'), 2000)
    return () => clearTimeout(timeout)
  }, [shareState])

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(totalPages, Math.max(1, page)))
    setSidebarOpen(false)
  }

  const toggleBookmark = (page: number) => {
    setBookmarks((previous) => {
      const next = new Set(previous)
      if (next.has(page)) {
        next.delete(page)
      } else {
        next.add(page)
      }
      return next
    })
  }

  const sharePage = async () => {
    const text = `${title} — ${t('page')} ${currentPage}`
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(text)
      setShareState('copied')
    } catch {
      setShareState('failed')
    }
  }

  const quickJumps = Array.from(
    { length: Math.ceil(totalPages / QUICK_JUMP_STEP) },
    (_, index) => (index + 1) * QUICK_JUMP_STEP,
  ).filter((page) => page <= totalPages)

  return (
    <DialogPrimitive.Root open onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={cn('fixed inset-0 z-50 flex flex-col bg-background', isDarkMode && 'dark')}
        >
          <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {t('page')} {currentPage} / {totalPages}
          </DialogPrimitive.Description>

          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
              aria-hidden="true"
            >
              <FileText className="h-4 w-4" />
            </span>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-balance text-sm font-semibold">{title}</h2>
              <p className="text-xs tabular-nums text-muted-foreground">
                {t('page')} {currentPage} / {totalPages}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11"
                onClick={() => setIsDarkMode((value) => !value)}
                aria-label={isDarkMode ? t('light_mode') : t('dark_mode')}
                aria-pressed={isDarkMode}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11"
                onClick={() => setSidebarOpen((value) => !value)}
                aria-label={t('navigation')}
                aria-expanded={sidebarOpen}
              >
                <Menu className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11"
                onClick={onClose}
                aria-label={t('close')}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Body */}
          <div className="relative flex flex-1 overflow-hidden">
            {sidebarOpen ? (
              <div className="absolute inset-y-0 start-0 z-20 w-64 overflow-y-auto border-e border-border bg-card shadow-lg md:static md:z-auto md:shadow-none">
                <div className="space-y-6 p-4">
                  <div>
                    <h3 className="mb-2 text-balance text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('bookmark')}
                    </h3>
                    <div className="space-y-1">
                      {bookmarks.size > 0 ? (
                        Array.from(bookmarks)
                          .sort((a, b) => a - b)
                          .map((page) => (
                            <button
                              key={page}
                              type="button"
                              onClick={() => goToPage(page)}
                              className="w-full rounded-md px-2 py-1.5 text-start text-sm font-medium text-primary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {t('page')} {page}
                            </button>
                          ))
                      ) : (
                        <p className="text-xs text-muted-foreground">{t('empty_bookmarks')}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-balance text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {language === 'ar'
                        ? 'الانتقال السريع'
                        : language === 'fr'
                          ? 'Navigation rapide'
                          : 'Quick jump'}
                    </h3>
                    <div className="space-y-1">
                      {quickJumps.map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => goToPage(page)}
                          className={cn(
                            'w-full rounded-md px-2 py-1.5 text-start text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            currentPage === page
                              ? 'bg-primary font-semibold text-primary-foreground'
                              : 'hover:bg-muted',
                          )}
                        >
                          {t('page')} {page}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex flex-1 items-start justify-center overflow-auto bg-muted/30 p-4">
              <Card
                className="relative flex aspect-[8.5/11] w-full max-w-2xl items-center justify-center bg-white shadow-lg dark:bg-ink-deep"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
              >
                <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8">
                  <div className="flex w-full flex-1 flex-col justify-center gap-4 text-center">
                    <FileText
                      className="mx-auto h-12 w-12 text-muted-foreground/30"
                      aria-hidden="true"
                    />
                    <p className="text-sm tabular-nums text-muted-foreground">
                      {t('page')} {currentPage}
                    </p>

                    <div className="mt-4 w-full space-y-2" aria-hidden="true">
                      {LINE_WIDTHS.map((width) => (
                        <div
                          key={width}
                          className="h-2 rounded bg-muted"
                          style={{ width: `${width}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="self-end text-sm tabular-nums text-muted-foreground">
                    {currentPage}
                  </p>
                </div>

                {bookmarks.has(currentPage) ? (
                  <Bookmark
                    className="absolute end-2 top-2 h-5 w-5 fill-gold text-gold"
                    aria-hidden="true"
                  />
                ) : null}
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="space-y-3 border-t border-border bg-card p-4">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11"
                onClick={() => setZoom((value) => Math.max(50, value - 10))}
                disabled={zoom <= 50}
                aria-label={
                  language === 'ar' ? 'تصغير' : language === 'fr' ? 'Zoom arrière' : 'Zoom out'
                }
              >
                <ZoomOut className="h-4 w-4" aria-hidden="true" />
              </Button>
              <span className="w-14 text-center text-sm font-medium tabular-nums">{zoom}%</span>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11"
                onClick={() => setZoom((value) => Math.min(200, value + 10))}
                disabled={zoom >= 200}
                aria-label={
                  language === 'ar' ? 'تكبير' : language === 'fr' ? 'Zoom avant' : 'Zoom in'
                }
              >
                <ZoomIn className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <Button
                variant="outline"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                <span className="hidden sm:inline">{t('previous')}</span>
              </Button>

              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(event) => {
                    const parsed = Number.parseInt(event.target.value, 10)
                    if (!Number.isNaN(parsed)) goToPage(parsed)
                  }}
                  aria-label={t('page')}
                  className="w-12 bg-transparent text-center font-semibold tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <span className="text-sm tabular-nums text-muted-foreground">/ {totalPages}</span>
              </div>

              <Button
                variant="outline"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                <span className="hidden sm:inline">{t('next')}</span>
                <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant={bookmarks.has(currentPage) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleBookmark(currentPage)}
                aria-pressed={bookmarks.has(currentPage)}
                className="gap-2"
              >
                <Bookmark
                  className={cn('h-4 w-4', bookmarks.has(currentPage) && 'fill-current')}
                  aria-hidden="true"
                />
                {t('bookmark')}
              </Button>

              <Button variant="outline" size="sm" className="gap-2" onClick={sharePage}>
                {shareState === 'copied' ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                )}
                {shareState === 'copied' ? t('copied') : t('share')}
              </Button>

              <p
                role="status"
                aria-live="polite"
                className={cn(
                  'text-xs',
                  shareState === 'failed' ? 'text-destructive' : 'text-muted-foreground',
                )}
              >
                {shareState === 'failed' ? t('copy_failed') : null}
              </p>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
