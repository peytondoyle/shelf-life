'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Book } from '@/types'

export default function BookDetailPage() {
  const { id } = useParams()
  const [book, setBook] = useState<Book | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [localBook, setLocalBook] = useState<Partial<Book>>({})

  useEffect(() => {
    if (id) {
      supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data }) => {
          setBook(data)
          setLocalBook(data)
        })
    }
  }, [id])

  const handleChange = (field: keyof Book, value: string) => {
    setLocalBook(prev => ({ ...prev, [field]: value }))
  }

  const handleScoreSubmit = async () => {
    if (!id) return

    const updatedBook = { ...localBook }
    const parseNumber = (val: string | number | null | undefined): number | null => {
      const parsed = parseFloat(String(val))
      return isNaN(parsed) ? null : parsed
    }

    const ratings = [
      { rating: parseNumber(updatedBook.rating_audible), reviews: parseNumber(updatedBook.reviews_audible) },
      { rating: parseNumber(updatedBook.rating_amazon), reviews: parseNumber(updatedBook.reviews_amazon) },
      { rating: parseNumber(updatedBook.rating_apple), reviews: parseNumber(updatedBook.reviews_apple) },
      { rating: parseNumber(updatedBook.rating_goodreads), reviews: parseNumber(updatedBook.reviews_goodreads) },
    ]

    const m = 100
    const globalAvg = 4.0
    const bayesian = (r: number, v: number) => (v / (v + m)) * r + (m / (v + m)) * globalAvg

    updatedBook.score_audible = ratings[0].rating && ratings[0].reviews ? bayesian(ratings[0].rating, ratings[0].reviews) : null
    updatedBook.score_amazon = ratings[1].rating && ratings[1].reviews ? bayesian(ratings[1].rating, ratings[1].reviews) : null
    updatedBook.score_apple = ratings[2].rating && ratings[2].reviews ? bayesian(ratings[2].rating, ratings[2].reviews) : null
    updatedBook.score_goodreads = ratings[3].rating && ratings[3].reviews ? bayesian(ratings[3].rating, ratings[3].reviews) : null

    const scores = [
      updatedBook.score_audible,
      updatedBook.score_amazon,
      updatedBook.score_apple,
      updatedBook.score_goodreads,
    ].filter((s): s is number => s !== null)

    updatedBook.average_score = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null

    const { error } = await supabase.from('books').update(updatedBook).eq('id', id)
    if (!error) {
      setBook(updatedBook as Book)
      setEditMode(false)
      alert('✅ Scores updated successfully!')
    }
  }

  if (!book) return <div>Loading…</div>

  return (
    <main className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-6 py-6 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
            {book.cover_image && (
              <img
                src={book.cover_image}
                alt="Cover"
                className="w-48 h-auto rounded-xl shadow-sm mb-4 sm:mb-0"
              />
            )}
            <div className="flex-1 space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
              <p className="text-gray-700 text-sm">By {book.author}</p>
              <p className="text-gray-500 text-sm italic">
                {book.format?.charAt(0).toUpperCase() + book.format?.slice(1)} • {book.published_year}
              </p>
              <p className="text-lg">⭐ {book.average_score?.toFixed(1) ?? '—'}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {['audible', 'amazon', 'apple', 'goodreads'].map(site => (
              <div
                key={site}
                className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3"
              >
                <h3 className="text-sm font-medium text-gray-900 capitalize">{site}</h3>
                {editMode ? (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input
                      type="number"
                      step="0.1"
                      value={localBook[`rating_${site}` as keyof Book] ?? ''}
                      onChange={e => handleChange(`rating_${site}` as keyof Book, e.target.value)}
                      className="p-2 border border-gray-300 rounded-md"
                      placeholder="Rating"
                    />
                    <input
                      type="number"
                      value={localBook[`reviews_${site}` as keyof Book] ?? ''}
                      onChange={e => handleChange(`reviews_${site}` as keyof Book, e.target.value)}
                      className="p-2 border border-gray-300 rounded-md"
                      placeholder="Reviews"
                    />
                  </div>
                ) : (
                  <div className="text-sm text-gray-700 mt-1">
                    <div>
                      {(book[`rating_${site}` as keyof Book] as number | null) ?? '—'}{' '}
                      <span className="text-xs text-gray-400">
                        ({(book[`reviews_${site}` as keyof Book] as number | null) ?? 0})
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Adjusted: ⭐{(book[`score_${site}` as keyof Book] as number | null)?.toFixed(2) ?? '—'}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={() => setEditMode(!editMode)}
              className="bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm transition mr-2"
            >
              {editMode ? 'Cancel' : 'Edit Scores'}
            </button>
            {editMode && (
              <button
                onClick={handleScoreSubmit}
                className="bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm transition"
              >
                Save Scores
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}