import { cookies } from "next/headers";
import { CopyButton } from "./copy";

function getSecret() {
  return fetch("https://generate-secret.vercel.app/32").then((r) => r.text());
}

export default async function Page() {
  // TODO: Save in cookie
  const state = await getSecret();
  const params = new URLSearchParams({ state });
  const $cookies = cookies();
  // TODO: Currently deleted when copies by not applying "HttpOnly"
  const credentials = $cookies.get("gh_result")?.value;

  if (credentials) {
    const { id, secret } = JSON.parse(credentials);
    const value = `\
AUTH_SECRET=${await getSecret()}
AUTH_GITHUB_ID=${id}
AUTH_GITHUB_SECRET=${secret}`;
    return (
      <div>
        <p>GitHub credentials:</p>
        <pre>{value}</pre>
        <CopyButton value={value} />
      </div>
    );
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
          redirect_url: "http://localhost:3000/redirect",
          // redirect_url: "https://authjs.dev/api/auth/github/callback",
          callback_urls: ["http://localhost:3000/api/auth/github/callback"],
          description: "An Auth.js development app, generated via authjs.dev",
          request_oauth_on_install: true,
        } satisfies Manifest)}
      />
      <button>Create GitHub Client</button>
    </form>
  );
}

/** @see https://docs.github.com/en/apps/sharing-github-apps/registering-a-github-app-from-a-manifest#github-app-manifest-parameters */
interface Manifest {
  /** The name of the GitHub App. */
  name?: string;
  /** Required. The homepage of your GitHub App. */
  url: string;
  /** The configuration of the GitHub App's webhook. */
  hook_attributes?: {
    /** Required. The URL of the server that will receive the webhook POST requests. */
    url: string;
    /** Deliver event details when this hook is triggered, defaults to true. */
    active?: boolean;
  };
  /** The full URL to redirect to after a user initiates the registration of a GitHub App from a manifest. */
  redirect_url: string;
  /** A full URL to redirect to after someone authorizes an installation. You can provide up to 10 callback URLs. */
  callback_urls?: string[];
  /** A full URL to redirect users to after they install your GitHub App if additional setup is required. */
  setup_url?: string;
  /** A description of the GitHub App. */
  description?: string;
  /** Set to true when your GitHub App is available to the public or false when it is only accessible to the owner of the app. */
  public?: boolean;
  /** The list of events the GitHub App subscribes to. */
  default_events?: string[];
  /** The set of permissions needed by the GitHub App. The format of the object uses the permission name for the key (for example, issues) and the access type for the value (for example, write). */
  default_permissions?: object;
  /** Set to true to request the user to authorize the GitHub App, after the GitHub App is installed. */
  request_oauth_on_install?: boolean;
  /** Set to true to redirect users to the setup_url after they update your GitHub App installation. */
  setup_on_update?: boolean;
}
