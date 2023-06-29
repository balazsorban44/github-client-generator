import { headers } from "next/headers";

export function getOrigin() {
  const $headers = headers();
  const origin = new URL(
    `${$headers.get("x-forwarded-proto")}://${$headers.get("host")}`
  );
  return origin;
}

export function getSecret() {
  return fetch("https://generate-secret.vercel.app/32").then((r) => r.text());
}
