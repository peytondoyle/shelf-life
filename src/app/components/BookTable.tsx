'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Book = {
  id: string
  title: string
  author: string
  format: 'audiobook' | 'print'
  status: 'read' | 'tbr' | 'dnf'
  created_at: string
}

export default function BookTable() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setBooks(data as Book[])
      }
      setLoading(false)
    }

    fetchBooks()
  }, [])

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">📖 Your Books</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : books.length === 0 ? (
        <p className="text-gray-500">No books added yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-sm font-medium">Title</th>
                <th className="p-3 text-sm font-medium">Author</th>
                <th className="p-3 text-sm font-medium">Format</th>
                <th className="p-3 text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm">{book.title}</td>
                  <td className="p-3 text-sm">{book.author}</td>
                  <td className="p-3 text-sm capitalize">{book.format}</td>
                  <td className="p-3 text-sm capitalize">{book.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
