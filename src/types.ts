// src/types.ts

export interface Book {
  id: string
  title: string
  author: string
  format: 'audiobook' | 'print'
  status: 'read' | 'tbr' | 'dnf'
  cover_image: string | null
  published_year: number | null
  created_at: string
}