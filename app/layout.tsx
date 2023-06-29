import "./global.css"
export const metadata = {
  title: "GitHub OAuth client generator",
  description: "An Auth.js side project (WIP)",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
