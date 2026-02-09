'use client'

import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Bookmark, Moon, Sun, Share2 } from 'lucide-react'
import { useState, useEffect } from 'react'

interface PDFViewerProps {
  title: string
  totalPages: number
  onClose: () => void
}

export function PDFViewer({ title, totalPages, onClose }: PDFViewerProps) {
  const { t, language } = useLanguage()
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const zoomIn = () => {
    if (zoom < 200) setZoom(zoom + 10)
  }

  const zoomOut = () => {
    if (zoom > 50) setZoom(zoom - 10)
  }

  const toggleBookmark = (page: number) => {
    setBookmarks((prev) => {
      const newBookmarks = new Set(prev)
      if (newBookmarks.has(page)) {
        newBookmarks.delete(page)
      } else {
        newBookmarks.add(page)
      }
      return newBookmarks
    })
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      setSidebarOpen(false)
    }
  }

  return (
    <div className={`fixed inset-0 ${isDarkMode ? 'dark' : ''} z-50`}>
      <div className="bg-background h-full flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold truncate">{title}</h2>
            <p className="text-sm text-muted-foreground">
              {language === 'ar'
                ? `الصفحة ${currentPage} من ${totalPages}`
                : language === 'fr'
                  ? `Page ${currentPage} sur ${totalPages}`
                  : `Page ${currentPage} of ${totalPages}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Bookmarks & Thumbnails */}
          {sidebarOpen && (
            <div className="w-48 border-r border-border bg-card overflow-y-auto">
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-3">
                    {language === 'ar'
                      ? 'المرجعيات'
                      : language === 'fr'
                        ? 'Marque-pages'
                        : 'Bookmarks'}
                  </h3>
                  <div className="space-y-2">
                    {bookmarks.size > 0 ? (
                      Array.from(bookmarks)
                        .sort((a, b) => a - b)
                        .map((page) => (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className="w-full text-left text-sm px-2 py-1 rounded hover:bg-muted transition-colors text-primary font-medium"
                          >
                            {language === 'ar'
                              ? `الصفحة ${page}`
                              : language === 'fr'
                                ? `Page ${page}`
                                : `Page ${page}`}
                          </button>
                        ))
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {language === 'ar'
                          ? 'لا توجد مرجعيات'
                          : language === 'fr'
                            ? 'Pas de marque-pages'
                            : 'No bookmarks'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-3">
                    {language === 'ar'
                      ? 'الانتقال السريع'
                      : language === 'fr'
                        ? 'Navigation rapide'
                        : 'Quick Jump'}
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {Array.from({ length: Math.ceil(totalPages / 10) }).map((_, i) => {
                      const page = (i + 1) * 10
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-full text-left text-sm px-2 py-1 rounded transition-colors ${
                            currentPage === page
                              ? 'bg-primary text-primary-foreground font-semibold'
                              : 'hover:bg-muted'
                          }`}
                        >
                          {language === 'ar'
                            ? `الصفحة ${page}`
                            : language === 'fr'
                              ? `Page ${page}`
                              : `Page ${page}`}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PDF Display Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-muted/30 overflow-auto">
            {/* Page Preview Box */}
            <Card
              className="w-full max-w-2xl aspect-[8.5/11] flex items-center justify-center bg-white dark:bg-slate-900 shadow-2xl relative"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-6">
                {/* Simulated PDF Content */}
                <div className="text-center space-y-4 flex-1 flex flex-col justify-center">
                  <div className="text-6xl opacity-20">📄</div>
                  <p className="text-muted-foreground text-sm">
                    {language === 'ar'
                      ? `الصفحة ${currentPage}`
                      : language === 'fr'
                        ? `Page ${currentPage}`
                        : `Page ${currentPage}`}
                  </p>

                  {/* Simulated text lines */}
                  <div className="space-y-2 text-left w-full mt-8">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="h-2 bg-muted rounded"
                        style={{ width: `${80 + Math.random() * 20}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Page Number */}
                <div className="absolute bottom-4 right-4 text-sm text-muted-foreground">
                  {currentPage}
                </div>
              </div>

              {/* Bookmark indicator */}
              {bookmarks.has(currentPage) && (
                <div className="absolute top-2 right-2 text-yellow-500">
                  <Bookmark className="w-5 h-5 fill-yellow-500" />
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="bg-card border-t border-border p-4 space-y-3">
          {/* Zoom Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="icon" onClick={zoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
            <Button variant="outline" size="icon" onClick={zoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" onClick={prevPage} disabled={currentPage === 1}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'السابق' : language === 'fr' ? 'Précédent' : 'Previous'}
            </Button>

            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value))}
                className="w-12 text-center bg-transparent font-semibold outline-none"
              />
              <span className="text-sm text-muted-foreground">/ {totalPages}</span>
            </div>

            <Button variant="outline" onClick={nextPage} disabled={currentPage === totalPages}>
              {language === 'ar' ? 'التالي' : language === 'fr' ? 'Suivant' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant={bookmarks.has(currentPage) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleBookmark(currentPage)}
              className="gap-2"
            >
              <Bookmark className="w-4 h-4" />
              {language === 'ar'
                ? 'مرجعية'
                : language === 'fr'
                  ? 'Marque-page'
                  : 'Bookmark'}
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Share2 className="w-4 h-4" />
              {language === 'ar' ? 'مشاركة' : language === 'fr' ? 'Partager' : 'Share'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
