'use client'

import React from 'react'

interface MetadataOverlayProps {
  status: {
    title: string
    author: string
    year: string
    cover: string
  }
  onRetry?: () => void
}

const statusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <span className="text-green-600">✓</span>
    case 'loading':
      return <span className="text-blue-600 animate-pulse">…</span>
    case 'error':
      return <span className="text-red-600">×</span>
    default:
      return <span className="text-gray-400">—</span>
  }
}

export default function MetadataOverlay({ status, onRetry }: MetadataOverlayProps) {
  const completed = Object.values(status).filter(s => s === 'success').length
  const progress = (completed / 4) * 100

  return (
    <div className="fixed bottom-6 right-6 w-64 bg-white border border-gray-200 shadow-lg rounded-lg p-4 z-50">
      <h4 className="text-sm font-medium text-gray-800 mb-2">Autofilling Metadata</h4>

      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className="bg-blue-500 h-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="text-sm text-gray-700 space-y-1">
        {(['title', 'author', 'year', 'cover'] as const).map((field) => (
          <li key={field} className="flex justify-between">
            <span className="capitalize">{field}</span>
            {statusIcon(status[field])}
          </li>
        ))}
      </ul>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 text-xs text-blue-600 hover:underline"
        >
          Retry
        </button>
      )}
    </div>
  )
}