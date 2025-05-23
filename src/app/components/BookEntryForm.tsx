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
      { title, author, format, status },
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
    <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl px-6 py-6 mb-12">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 flex items-center gap-2">
        📚 Add a Book
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 h-[38px] text-sm shadow-sm focus:ring-gray-700 focus:border-gray-700 bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 h-[38px] text-sm shadow-sm focus:ring-gray-700 focus:border-gray-700 bg-white"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <div className="relative">
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as 'audiobook' | 'print')}
                className="appearance-none w-full h-[38px] pl-3 pr-10 text-sm border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700"
              >
                <option value="audiobook">Audiobook</option>
                <option value="print">Print</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center">
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-1 mt-4 sm:mt-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'read' | 'tbr' | 'dnf')}
                className="appearance-none w-full h-[38px] pl-3 pr-10 text-sm border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700"
              >
                <option value="tbr">To Be Read</option>
                <option value="read">Read</option>
                <option value="dnf">Did Not Finish</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center">
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Book'}
        </button>
      </form>
    </div>
  )
}