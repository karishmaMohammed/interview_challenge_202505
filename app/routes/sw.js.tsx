import { json } from "@remix-run/node";

export function loader() {
  return new Response("", {
    status: 200,
    headers: {
      "Content-Type": "application/javascript",
    },
  });
}
