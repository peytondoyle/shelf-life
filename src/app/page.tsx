import BookEntryForm from '@/app/components/BookEntryForm'
import BookTable from '@/app/components/BookTable'

export default function HomePage() {
  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📚 Shelf Life</h1>
      <BookEntryForm />
      <BookTable />
    </main>
  )
}