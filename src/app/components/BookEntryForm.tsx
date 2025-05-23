'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function BookEntryForm() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [format, setFormat] = useState<'audiobook' | 'print'>('audiobook')
  const [status, setStatus] = useState<'read' | 'tbr' | 'dnf'>('tbr')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { error } = await supabase.from('books').insert([
      {
        title,
        author,
        format,
        status,
      },
    ])

    setIsSubmitting(false)

    if (error) {
      alert('Error adding book: ' + error.message)
    } else {
      setSuccess(true)
      setTitle('')
      setAuthor('')
      setStatus('tbr')
      setFormat('audiobook')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-xl w-full space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Add a Book</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Author</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Format</label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as 'audiobook' | 'print')}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="audiobook">Audiobook</option>
          <option value="print">Print</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as 'read' | 'tbr' | 'dnf')}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="read">Read</option>
          <option value="tbr">To Be Read</option>
          <option value="dnf">Did Not Finish</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
      >
        {isSubmitting ? 'Adding...' : 'Add Book'}
      </button>

      {success && <p className="text-green-600 text-sm mt-2">Book added successfully!</p>}
    </form>
  )
}