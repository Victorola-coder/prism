"use client"

import { Component, type ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 px-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ef4444]/10">
            <AlertTriangle size={28} className="text-[#ef4444]" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-[#fafafa]">Something went wrong</h3>
            <p className="mt-1 max-w-md text-sm text-[#a1a1aa]">
              {this.state.error?.message ?? "An unexpected error occurred"}
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={this.handleRetry}>
            <RefreshCw size={14} />
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
