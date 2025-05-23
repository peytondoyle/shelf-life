'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Book } from '@/lib/types'

export default function BookDetailPage() {
  const { id } = useParams()
  const [book, setBook] = useState<Book | null>(null)

  useEffect(() => {
    supabase.from('books').select('*').eq('id', id).single().then(({ data }) => {
      setBook(data)
    })
  }, [id])

  if (!book) return <div>Loading...</div>

  return (
    <div>
      <h1>{book.title}</h1>
      <p>By {book.author}</p>
      {book.average_score != null && <p>⭐ {book.average_score.toFixed(1)}</p>}
      {book.cover_image && <img src={book.cover_image} alt="Cover" />}
    </div>
  )
}