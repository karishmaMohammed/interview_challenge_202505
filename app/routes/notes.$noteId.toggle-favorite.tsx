import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { queries } from "~/db/schema";
import { requireUserId } from "~/services/auth.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const noteId = Number(params.noteId);

  if (isNaN(noteId)) {
    return json({ error: "Invalid note ID" }, { status: 400 });
  }

  try {
    const [updatedNote] = await queries.notes.toggleFavorite(noteId, userId);
    if (!updatedNote) {
      return json({ error: "Note not found" }, { status: 404 });
    }
    
    // Redirect back to the notes page to refresh the list
    return redirect("/notes");
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return json({ error: "Failed to toggle favorite" }, { status: 500 });
  }
} 