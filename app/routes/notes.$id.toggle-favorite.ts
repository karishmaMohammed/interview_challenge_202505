
import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/services/session.server";
import { toggleFavorite } from "~/services/notes.server";

export async function action({ params, request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const noteId = parseInt(params.id || "", 10);

  if (isNaN(noteId)) {
    return json({ error: "Invalid note ID" }, { status: 400 });
  }

  await toggleFavorite(noteId, userId);
  return redirect("/notes");
}
