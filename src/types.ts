export interface Book {
  id: string
  title: string
  author: string
  format: 'audiobook' | 'print'
  status: 'read' | 'tbr' | 'dnf'
  cover_image: string | null
  published_year: number | null
  created_at: string
  average_score?: number | null
  rating_audible?: number | null
  reviews_audible?: number | null
  score_audible?: number | null
  rating_amazon?: number | null
  reviews_amazon?: number | null
  score_amazon?: number | null
  rating_apple?: number | null
  reviews_apple?: number | null
  score_apple?: number | null
  rating_goodreads?: number | null
  reviews_goodreads?: number | null
  score_goodreads?: number | null
}