'use client'
 
import { useEffect } from 'react'
import Link from 'next/link'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-4xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-xl mb-8">We apologize for the inconvenience.</p>
      <div className="flex space-x-4">
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try again
        </button>
        <Link href="/" className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
          Go back home
        </Link>
      </div>
    </div>
  )
}