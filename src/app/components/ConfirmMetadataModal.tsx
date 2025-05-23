'use client'

import React from 'react'
import { Dialog } from '@headlessui/react'

interface ConfirmMetadataModalProps {
  title: string
  author: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmMetadataModal({ title, author, onConfirm, onCancel }: ConfirmMetadataModalProps) {
  return (
    <Dialog open onClose={onCancel} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
          Confirm Book Details
        </Dialog.Title>
        <p className="text-sm text-gray-700 mb-4">
          We found a match for <strong>{title}</strong> by <strong>{author}</strong>.
          Does this look correct?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md border border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-500"
          >
            Confirm
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  )
}