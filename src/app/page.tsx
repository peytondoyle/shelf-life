'use client'

import { useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function HomePage() {
  useEffect(() => {
    async function testSupabase() {
      const { data, error } = await supabase.from('books').select('*')
      console.log('✅ Supabase Test:', { data, error })
    }

    testSupabase()
  }, [])

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">📚 Shelf Life</h1>
      <p className="mt-4 text-gray-600">Testing Supabase connection… check the console.</p>
    </main>
  )
}