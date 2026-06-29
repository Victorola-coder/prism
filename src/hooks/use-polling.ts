"use client"

import { useState, useEffect, useRef } from "react"

interface PollingOptions {
  interval?: number
  enabled?: boolean
}

export function usePolling<T>(
  fetcher: () => Promise<T>,
  { interval = 2000, enabled = true }: PollingOptions = {},
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const savedFetcher = useRef(fetcher)

  useEffect(() => {
    savedFetcher.current = fetcher
  }, [fetcher])

  useEffect(() => {
    if (!enabled) return

    const poll = async () => {
      try {
        const result = await savedFetcher.current()
        setData(result)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Polling failed")
      } finally {
        setIsLoading(false)
      }
    }

    poll()
    const id = setInterval(poll, interval)

    return () => clearInterval(id)
  }, [interval, enabled])

  return { data, isLoading, error }
}
