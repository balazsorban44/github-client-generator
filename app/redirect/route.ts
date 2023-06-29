import { cookies } from "next/headers";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const code = params.get("code");
  if (!code) return new Response("Missing code", { status: 400 });

  // TODO: Add state check

  const res = await fetch(
    `https://api.github.com/app-manifests/${code}/conversions`,
    { method: "POST" }
  );
  const result = await res.json();
  cookies().set({
    name: "gh_result",
    value: JSON.stringify({
      id: result.client_id,
      secret: result.client_secret,
    }),
    maxAge: 1000 * 60 * 60,
    // TODO: Cannot delete after copying if this is true
    // httpOnly: true,
  });
  return Response.redirect("http://localhost:3000");
}
