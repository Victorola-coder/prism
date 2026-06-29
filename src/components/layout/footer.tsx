import { APP_NAME } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t border-[#1f1f1f]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#6366f1] to-[#06b6d4]">
            <span className="text-xs font-bold text-white">P</span>
          </div>
          <span className="text-sm text-[#52525b]">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#52525b] transition-colors hover:text-[#a1a1aa]"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#52525b] transition-colors hover:text-[#a1a1aa]"
          >
            Twitter
          </a>
          <a
            href="mailto:hello@prism.dev"
            className="text-sm text-[#52525b] transition-colors hover:text-[#a1a1aa]"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
