'use client'

import { useState } from 'react'
import { BookOpen, BookMarked, ChevronRight } from 'lucide-react'

import { useLanguage } from '@/app/context/language-context'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { PDFViewer } from '@/components/pdf-viewer'
import { cn } from '@/lib/utils'
import books from '@/data/books.json'

type Book = (typeof books)[0]

export default function LibraryPage() {
  const { t, language } = useLanguage()
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const bookTitle = (book: Book) =>
    language === 'ar' ? book.ar : language === 'fr' ? book.fr : book.en

  const bookDescription = (book: Book) => book.description[language]

  if (selectedBook) {
    return (
      <PDFViewer
        title={bookTitle(selectedBook)}
        totalPages={selectedBook.pages}
        onClose={() => setSelectedBook(null)}
      />
    )
  }

  return (
    <main
      id="main-content"
      className="min-h-screen pb-[calc(5.5rem_+_env(safe-area-inset-bottom))] md:ms-64 md:pb-12"
    >
      <Navigation />

      <PageHeader title={t('library')} icon={BookOpen} />

      <div className="mx-auto max-w-6xl px-6 py-8 md:px-8">
        <p className="mb-8 max-w-2xl text-pretty text-sm text-muted-foreground md:text-base">
          {language === 'ar'
            ? 'اختر كتاباً لبدء القراءة'
            : language === 'fr'
              ? 'Choisissez un livre pour commencer la lecture'
              : 'Choose a book to start reading'}
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => setSelectedBook(book)}
              aria-label={`${bookTitle(book)} — ${t('page')} ${book.pages}`}
              className="group block w-full text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span
                className={cn(
                  'relative flex h-60 items-end overflow-hidden rounded-xl p-5 text-white shadow-sm transition-[box-shadow,transform] duration-200 group-hover:-translate-y-1 group-hover:shadow-lg group-active:translate-y-0',
                  book.cover,
                )}
              >
                <span className="absolute inset-0 bg-black/35" aria-hidden="true" />
                <span
                  className="zellige-night absolute inset-0 opacity-50"
                  aria-hidden="true"
                />

                <span className="relative z-10 block space-y-1.5">
                  <BookMarked className="mb-2 h-6 w-6 opacity-80" aria-hidden="true" />
                  <span className="block text-balance font-display text-lg font-semibold leading-snug">
                    {bookTitle(book)}
                  </span>
                  <span className="block text-xs text-white/80">{book.author}</span>
                </span>
              </span>

              <span className="mt-3 block space-y-1.5 px-0.5">
                <span className="block text-sm leading-relaxed text-muted-foreground">
                  {bookDescription(book)}
                </span>
                <span className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-muted-foreground">
                    {book.pages}{' '}
                    {language === 'ar' ? 'صفحة' : language === 'fr' ? 'pages' : 'pages'}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-gold-ink dark:text-gold-light">
                    {language === 'ar' ? 'اقرأ' : language === 'fr' ? 'Lire' : 'Read'}
                    <ChevronRight
                      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
