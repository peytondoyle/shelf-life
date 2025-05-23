'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Fragment } from 'react'

interface ConfirmMetadataModalProps {
  title: string
  author: string
  imageOptions: string[]
  selectedImage: string | null
  onSelectImage: (img: string | null) => void
  onConfirm: (img: string | null) => void
  onCancel: () => void
}

export default function ConfirmMetadataModal({
  title,
  author,
  imageOptions,
  selectedImage,
  onSelectImage,
  onConfirm,
  onCancel,
}: ConfirmMetadataModalProps) {
  return (
    <Dialog as={Fragment} open={true} onClose={onCancel}>
      <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
        <DialogPanel className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <DialogTitle className="text-lg font-semibold text-gray-900 mb-2">
            Confirm Book Details
          </DialogTitle>
          <p className="text-sm text-gray-700 mb-4">
            We found a match for <strong>{title}</strong> by <strong>{author}</strong>.<br />
            Does this look correct?
          </p>

          {imageOptions.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center mb-4">
            {imageOptions.map((img) => (
                <button
                key={img}
                type="button"
                onClick={() => onSelectImage(img)}
                className={`border rounded-md overflow-hidden transition ${
                    selectedImage === img
                    ? 'ring-2 ring-blue-500 border-blue-500'
                    : 'border-gray-300 hover:ring-1 hover:ring-gray-400'
                }`}
                >
                <img src={img} alt="Cover option" className="w-[80px] h-auto object-contain rounded" />
                </button>
            ))}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(selectedImage)}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-500 transition"
            >
              Confirm
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}