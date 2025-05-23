'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { fetchBookData, BookMetadata } from '@/lib/fetchBookData'
import MetadataOverlay from './MetadataOverlay'
import ConfirmMetadataModal from './ConfirmMetadataModal'
import { toast } from 'sonner'

export default function BookEntryForm({ onBookAdded }: { onBookAdded: () => void }) {
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
    message: '',
  })
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [metadataCandidate, setMetadataCandidate] = useState<BookMetadata | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const controllerRef = useRef<AbortController | null>(null)

  const updateStatus = (field: string, state: 'idle' | 'loading' | 'success' | 'error', message?: string) => {
    setMetadataStatus((prev) => ({ ...prev, [field]: state, message: message || prev.message }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowOverlay(true)
    setMetadataStatus((prev) => ({ ...prev, message: 'Searching Open Library…' }))

    updateStatus('title', 'loading')
    updateStatus('author', 'loading')
    updateStatus('year', 'loading')
    updateStatus('cover', 'loading')

    if (controllerRef.current) controllerRef.current.abort()
    controllerRef.current = new AbortController()

    const metadata = await fetchBookData(title.trim(), author.trim(), controllerRef.current.signal)

    if (metadata) {
      setMetadataCandidate(metadata)
      setSelectedImage(metadata.coverImage || null)
      setShowConfirmModal(true)
    } else {
      finalizeSubmission()
    }

    setIsSubmitting(false)
  }

  const applyMetadata = (metadata: BookMetadata, image?: string | null) => {
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

    if (image) {
      setCover(image)
      updateStatus('cover', 'success')
    } else updateStatus('cover', 'error')

    setMetadataStatus((prev) => ({ ...prev, message: 'Book metadata filled!' }))
  }

  const finalizeSubmission = async (overrideMetadata?: BookMetadata, image?: string | null) => {
    const book = {
      title: overrideMetadata?.title || title,
      author: overrideMetadata?.author || author,
      format,
      status,
      published_year: overrideMetadata?.publishedYear?.toString() || year || null,
      cover_image: image || overrideMetadata?.coverImage || cover || null,
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
      setSelectedImage(null)
      toast.success('Book added successfully!')
      onBookAdded()
    }
  }

  const handleConfirm = (img: string | null) => {
    setShowConfirmModal(false)
    setSelectedImage(img)
    if (metadataCandidate) {
      applyMetadata(metadataCandidate, img)
      finalizeSubmission(metadataCandidate, img)
    } else {
      finalizeSubmission()
    }
  }

  return (
    <div className="relative bg-gray-50 border border-gray-200 shadow-sm rounded-xl px-6 py-6 mb-12">
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
          imageOptions={metadataCandidate.imageOptions || []}
          selectedImage={selectedImage}
          onSelectImage={setSelectedImage}
          onConfirm={handleConfirm}
          onCancel={() => handleConfirm(null)}
        />
      )}
    </div>
  )
}