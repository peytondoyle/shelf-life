'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { fetchBookData } from '@/lib/fetchBookData'
import { toast } from 'sonner'
import MetadataOverlay from './MetadataOverlay'
import ConfirmMetadataModal from './ConfirmMetadataModal'


interface BookEntryFormProps {
  onBookAdded: () => void
}

export default function BookEntryForm({ onBookAdded }: BookEntryFormProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [format, setFormat] = useState<'audiobook' | 'print'>('audiobook')
  const [status, setStatus] = useState<'read' | 'tbr' | 'dnf'>('tbr')
  const [cover, setCover] = useState('')
  const [year, setYear] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [showOverlay, setShowOverlay] = useState(false)
  const [metadataStatus, setMetadataStatus] = useState({
    title: 'idle',
    author: 'idle',
    year: 'idle',
    cover: 'idle',
  })
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [metadataCandidate, setMetadataCandidate] = useState<any>(null)

  const updateStatus = (field: string, state: 'idle' | 'loading' | 'success' | 'error') => {
    setMetadataStatus((prev) => ({ ...prev, [field]: state }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowOverlay(true)

    updateStatus('title', 'loading')
    updateStatus('author', 'loading')
    updateStatus('year', 'loading')
    updateStatus('cover', 'loading')

    const metadata = await fetchBookData(title.trim(), author.trim())

    if (metadata) {
      setMetadataCandidate(metadata)
      if (
        metadata.title.toLowerCase() !== title.trim().toLowerCase() ||
        metadata.author.toLowerCase() !== author.trim().toLowerCase()
      ) {
        setShowConfirmModal(true)
        setIsSubmitting(false)
        return
      }
      applyMetadata(metadata)
    }

    finalizeSubmission()
  }

  const applyMetadata = (metadata: any) => {
    if (metadata.title) {
      setTitle(metadata.title)
      updateStatus('title', 'success')
    } else updateStatus('title', 'error')

    if (metadata.author) {
      setAuthor(metadata.author)
      updateStatus('author', 'success')
    } else updateStatus('author', 'error')

    if (metadata.publishedYear) {
      setYear(metadata.publishedYear.toString())
      updateStatus('year', 'success')
    } else updateStatus('year', 'error')

    if (metadata.coverImage) {
      setCover(metadata.coverImage)
      updateStatus('cover', 'success')
    } else updateStatus('cover', 'error')
  }

  const finalizeSubmission = async (overrideMetadata?: any) => {
    const book = {
      title: overrideMetadata?.title || title,
      author: overrideMetadata?.author || author,
      format,
      status,
      published_year: overrideMetadata?.publishedYear?.toString() || year || null,
      cover_image: overrideMetadata?.coverImage || cover || null,
    }

    const { error } = await supabase.from('books').insert([book])

    setShowOverlay(false)
    setIsSubmitting(false)

    if (error) {
      alert('Error adding book: ' + error.message)
    } else {
      setTitle('')
      setAuthor('')
      setStatus('tbr')
      setFormat('audiobook')
      setCover('')
      setYear('')
      onBookAdded() // 🔁 notify parent to refresh book list
      toast.success('Book added successfully!')
    }
  }

  const handleConfirm = (accept: boolean) => {
    setShowConfirmModal(false)
    if (accept && metadataCandidate) {
      applyMetadata(metadataCandidate)
      finalizeSubmission(metadataCandidate)
    } else {
      finalizeSubmission()
    }
  }

  return (
    <div className="relative bg-gray-50 border border-gray-200 shadow-sm rounded-xl px-6 py-6 mb-12">
    {showSuccess && (
    <p className="text-sm text-green-600 mt-4">✅ Book added successfully!</p>
    )}
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
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'audiobook' | 'print')}
              className="appearance-none w-full h-[38px] pl-3 pr-10 text-sm border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700"
            >
              <option value="audiobook">Audiobook</option>
              <option value="print">Print</option>
            </select>
          </div>

          <div className="flex-1 mt-4 sm:mt-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'read' | 'tbr' | 'dnf')}
              className="appearance-none w-full h-[38px] pl-3 pr-10 text-sm border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700"
            >
              <option value="tbr">To Be Read</option>
              <option value="read">Read</option>
              <option value="dnf">Did Not Finish</option>
            </select>
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

      {showOverlay && <MetadataOverlay status={metadataStatus} />}
      {showConfirmModal && metadataCandidate && (
        <ConfirmMetadataModal
          title={metadataCandidate.title}
          author={metadataCandidate.author}
          onConfirm={() => handleConfirm(true)}
          onCancel={() => handleConfirm(false)}
        />
      )}
    </div>
  )
}