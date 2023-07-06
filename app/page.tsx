import { cookies } from "next/headers"
import { CopyButton } from "./components"
import { getOrigin, getSecret } from "./utils"

export default async function Page() {
  // TODO: Save in cookie
  const state = await getSecret()
  const params = new URLSearchParams({ state })
  const $cookies = cookies()
  const origin = getOrigin()

  // HACK: Currently deleted when copy button clicked. We can do it because we did not apply "HttpOnly".
  const credentials = $cookies.get("gh_result")?.value

  if (credentials) {
    const { id, secret } = JSON.parse(credentials)
    const value = `\
AUTH_SECRET=${await getSecret()}
AUTH_GITHUB_ID=${id}
AUTH_GITHUB_SECRET=${secret}`
    return (
      <div className="flex flex-col gap-4 m-2 items-start">
        <h1>Generated Auth.js environment variables</h1>
        <pre className="bg-gray-100 p-2 pt-0">
          <p className="text-xs pt-1 border border-t-0 border-l-0 border-r-0">
            .env.local
          </p>
          <br />
          {value}
        </pre>
        <CopyButton value={value} />
      </div>
    )
  }
  return (
    <form
      action={`https://github.com/settings/apps/new?${params}`}
      method="post"
    >
      <input
        hidden
        type="text"
        name="manifest"
        id="manifest"
        defaultValue={JSON.stringify({
          name: "Auth.js dev",
          url: "https://authjs.dev/reference/core/providers_github",
          redirect_url: `${origin}/redirect`,
          // redirect_url: "https://authjs.dev/api/auth/callback/github",
          callback_urls: ["http://localhost:3000/api/auth/callback/github"],
          description: "An Auth.js development app, generated via authjs.dev",
          request_oauth_on_install: true,
        } satisfies Manifest)}
      />
      <button className="flex items-center gap-2 p-2 m-2 bg-gray-700 rounded-md border text-white text-xs hover:bg-gray-500 transition-colors focus:bg-black">
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="h-4 w-4"
        >
          <title>GitHub</title>
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
        Create GitHub Client
      </button>
    </form>
  )
}

/** @see https://docs.github.com/en/apps/sharing-github-apps/registering-a-github-app-from-a-manifest#github-app-manifest-parameters */
interface Manifest {
  /** The name of the GitHub App. */
  name?: string
  /** Required. The homepage of your GitHub App. */
  url: string
  /** The configuration of the GitHub App's webhook. */
  hook_attributes?: {
    /** Required. The URL of the server that will receive the webhook POST requests. */
    url: string
    /** Deliver event details when this hook is triggered, defaults to true. */
    active?: boolean
  }
  /** The full URL to redirect to after a user initiates the registration of a GitHub App from a manifest. */
  redirect_url: string
  /** A full URL to redirect to after someone authorizes an installation. You can provide up to 10 callback URLs. */
  callback_urls?: string[]
  /** A full URL to redirect users to after they install your GitHub App if additional setup is required. */
  setup_url?: string
  /** A description of the GitHub App. */
  description?: string
  /** Set to true when your GitHub App is available to the public or false when it is only accessible to the owner of the app. */
  public?: boolean
  /** The list of events the GitHub App subscribes to. */
  default_events?: string[]
  /** The set of permissions needed by the GitHub App. The format of the object uses the permission name for the key (for example, issues) and the access type for the value (for example, write). */
  default_permissions?: object
  /** Set to true to request the user to authorize the GitHub App, after the GitHub App is installed. */
  request_oauth_on_install?: boolean
  /** Set to true to redirect users to the setup_url after they update your GitHub App installation. */
  setup_on_update?: boolean
}
