'use client'

import BookEntryForm from '@/app/components/BookEntryForm'
import BookTable from '@/app/components/BookTable'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-gray-900">📚 Shelf Life</h1>
        <BookEntryForm />
        <BookTable />
      </div>
    </main>
  )
}