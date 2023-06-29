"use client"

export function CopyButton({ value }: { value: string }) {
  return (
    <button
      onClick={() => {
        document.cookie =
          "gh_result=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        navigator.clipboard.writeText(value)
      }}
    >
      Copy
    </button>
  )
}
