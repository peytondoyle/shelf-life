'use client'

import type { Book } from '@/types'
import { useRouter } from 'next/navigation'

interface BookTableProps {
  books: Book[]
  loading: boolean
}

const formatBadge = (format: Book['format']) => {
  const base = 'px-2 py-1 rounded-full text-xs font-medium'
  if (format === 'audiobook') return <span className={`bg-blue-100 text-blue-800 ${base}`}>Audiobook</span>
  return <span className={`bg-green-100 text-green-800 ${base}`}>Print</span>
}

const statusBadge = (status: Book['status']) => {
  const base = 'px-2 py-1 rounded-full text-xs font-medium'
  switch (status) {
    case 'read': return <span className={`bg-emerald-100 text-emerald-800 ${base}`}>Read</span>
    case 'tbr': return <span className={`bg-yellow-100 text-yellow-800 ${base}`}>TBR</span>
    case 'dnf': return <span className={`bg-red-100 text-red-800 ${base}`}>DNF</span>
  }
}

export default function BookTable({ books, loading }: BookTableProps) {
  const router = useRouter()
  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">📚 Your Books</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : books.length === 0 ? (
        <p className="text-gray-400 italic">No books added yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Cover</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Author</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Format</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Year</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Score</th>                
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, idx) => (
                <tr
                  key={book.id}
                  onClick={() => router.push(`/book/${book.id}`)}
                  className={`cursor-pointer hover:bg-gray-100 transition ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-3">
                    {book.cover_image && (
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="w-10 h-auto rounded"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{book.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{book.author}</td>
                  <td className="px-4 py-3 text-sm">{formatBadge(book.format)}</td>
                  <td className="px-4 py-3 text-sm">{book.published_year ?? '—'}</td>
                  <td className="px-4 py-3 text-sm">
                    {book.average_score != null ? `⭐ ${book.average_score.toFixed(1)}` : '—'}
                  </td>
                  <td className="px-4 py-3">{statusBadge(book.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}