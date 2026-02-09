'use client'

import { useLanguage } from '@/app/context/language-context'
import { Navigation } from '@/components/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { PDFViewer } from '@/components/pdf-viewer'
import books from '@/data/books.json'

export default function LibraryPage() {
  const { t, language } = useLanguage()
  const [selectedBook, setSelectedBook] = useState<(typeof books)[0] | null>(null)

  const getBookTitle = (book: (typeof books)[0]) => {
    return language === 'ar' ? book.ar : language === 'fr' ? book.fr : book.en
  }

  const getBookDescription = (book: (typeof books)[0]) => {
    return language === 'ar' ? book.description.ar : language === 'fr' ? book.description.fr : book.description.en
  }

  if (selectedBook) {
    return <PDFViewer title={getBookTitle(selectedBook)} totalPages={selectedBook.pages} onClose={() => setSelectedBook(null)} />
  }

  return (
    <main className="pb-24 md:pb-0 md:ml-20 islamic-pattern min-h-screen">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white p-6 md:p-8 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{t('library')}</h1>
      </div>

      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <p className="text-muted-foreground mb-8">
          {language === 'ar'
            ? 'اختر كتاباً لبدء القراءة'
            : language === 'fr'
              ? 'Choisissez un livre pour commencer la lecture'
              : 'Choose a book to start reading'}
        </p>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className="cursor-pointer group"
            >
              {/* Book Cover */}
              <div
                className={`${book.cover} rounded-lg h-64 flex items-end justify-center p-6 text-white relative overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2`}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

                {/* Content */}
                <div className="relative z-10 text-center space-y-2">
                  <BookOpen className="w-8 h-8 mx-auto opacity-70" />
                  <h3 className="font-bold text-lg text-balance">{getBookTitle(book)}</h3>
                  <p className="text-sm text-white/80">{book.author}</p>
                </div>
              </div>

              {/* Book Info */}
              <div className="mt-3 space-y-2">
                <p className="text-sm text-muted-foreground">{getBookDescription(book)}</p>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar'
                    ? `${book.pages} صفحة`
                    : language === 'fr'
                      ? `${book.pages} pages`
                      : `${book.pages} pages`}
                </p>
                <Button className="w-full" size="sm">
                  {language === 'ar' ? 'اقرأ الآن' : language === 'fr' ? 'Lire maintenant' : 'Read Now'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
