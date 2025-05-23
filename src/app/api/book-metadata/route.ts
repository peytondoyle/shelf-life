import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || ''
  const author = searchParams.get('author') || ''

  const buildUrl = (t?: string, a?: string) => {
    const params = new URLSearchParams()
    if (t) params.append('title', t)
    if (a) params.append('author', a)
    params.append('limit', '1')
    return `https://openlibrary.org/search.json?${params.toString()}`
  }

  // Attempt full match
  let res = await fetch(buildUrl(title, author))
  let data = await res.json()

  // If nothing found, try just title
  if (!data.docs?.length && title) {
    res = await fetch(buildUrl(title))
    data = await res.json()
  }

  // If still nothing, try just author
  if (!data.docs?.length && author) {
    res = await fetch(buildUrl(undefined, author))
    data = await res.json()
  }

  const doc = data.docs?.[0]

  if (!doc) {
    return NextResponse.json({}, { status: 200 })
  }

  return NextResponse.json({
    title: doc.title,
    author: doc.author_name?.[0] || '',
    publishedYear: doc.first_publish_year || null,
    coverImage: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null
  })
}