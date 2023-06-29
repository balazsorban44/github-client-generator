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
      <body className="flex flex-col h-screen justify-between">
        {children}
        <footer className="self-center p-14 flex gap-2 items-baseline">
          <p className="text-sm">
            An{" "}
            <a className="underline" href="https://authjs.dev">
              Auth.js
            </a>{" "}
            side-project to generate GitHub OAuth clients for development by
          </p>
          <a className="underline" href="https://github.com/balazsorban44">
            Balázs Orbán
          </a>
          {" ▴ "}
          <a
            className="underline"
            href="https://github.com/balazsorban44/github-client-generator"
          >
            Source
          </a>
        </footer>
      </body>
    </html>
  )
}
