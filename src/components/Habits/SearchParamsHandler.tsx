'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface SearchParamsHandlerProps {
  onCreateModal: (show: boolean) => void
}

export default function SearchParamsHandler({ onCreateModal }: SearchParamsHandlerProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const createParam = searchParams.get('create')
    if (createParam === 'true') {
      onCreateModal(true)
      // Clean up URL without the parameter
      router.replace('/habits', { scroll: false })
    }
  }, [searchParams, router, onCreateModal])

  return null
}
