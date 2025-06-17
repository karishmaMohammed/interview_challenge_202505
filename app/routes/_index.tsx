import type { MetaFunction } from "@remix-run/node";
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { getUserId } from "~/services/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (!userId) {
    return redirect("/login");
  }
  return redirect("/notes");
}

export default function Index() {
  return <div>Hello World</div>;
}