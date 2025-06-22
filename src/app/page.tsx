'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Book } from '@/types'
import BookEntryForm from '@/app/components/BookEntryForm'
import BookTable from '@/app/components/BookTable'

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)

  const fetchBooks = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch books:', error.message)
    } else {
      setBooks(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleBookAdded = () => {
    fetchBooks()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <BookEntryForm onBookAdded={handleBookAdded} />
      <BookTable books={books} loading={loading} />
    </div>
  )
}