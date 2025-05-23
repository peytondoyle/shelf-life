export async function fetchBookData(title: string, author: string) {
  const params = new URLSearchParams()
  if (title) params.append('title', title)
  if (author) params.append('author', author)

  try {
    const res = await fetch(`/api/book-metadata?${params.toString()}`)
    if (!res.ok) throw new Error(`Failed to fetch metadata: ${res.status}`)

    const data = await res.json()
    return {
      title: data.title || '',
      author: data.author || '',
      publishedYear: data.publishedYear || null,
      coverImage: data.coverImage || null,
    }
  } catch (err) {
    console.error('fetchBookData error:', err)
    return null
  }
}