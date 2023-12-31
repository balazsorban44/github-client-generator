"use client"

import { useRouter } from "next/navigation"
import { Toaster, toast } from "sonner"

export function CopyButton({ value }: any) {
  const router = useRouter()
  return (
    <button
      className="p-2 bg-gray-700 rounded-md border text-white text-xs hover:bg-gray-500 transition-colors focus:bg-black"
      onClick={() => {
        document.cookie =
          "gh_result=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        navigator.clipboard.writeText(value)
        toast('Copied to Clipboard')
        router.refresh()
      }}
    >
      Copy
    </button>
  )
}

export {
  Toaster
}
