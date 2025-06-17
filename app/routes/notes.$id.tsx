import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import { NoteDetail } from "~/components/notes/note-detail";
import { NoteDetailSkeleton } from "~/components/notes/note-detail-skeleton";
import { getNoteByIdAndUser, updateNote, deleteNote } from "~/services/notes.server";
import { requireUserId } from "~/services/session.server";
import { noteSchema } from "~/schemas/notes";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const noteId = parseInt(params.id || "", 10);

  if (isNaN(noteId)) {
    throw new Response("Invalid note ID", { status: 400 });
  }

  const userId = await requireUserId(request);
  const note = await getNoteByIdAndUser(noteId, userId);
  if (!note) {
    throw new Response("Note not found", { status: 404 });
  }

  return json({ note });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const noteId = parseInt(params.id || "", 10);
  if (isNaN(noteId)) {
    return json({ error: "Invalid note ID" }, { status: 400 });
  }

  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    const success = await deleteNote(noteId, userId);
    if (!success) {
      return json({ error: "Failed to delete note" }, { status: 500 });
    }
    return json({ success: true });
  }

  if (intent === "update") {
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
    };

    const result = noteSchema.safeParse(data);
    if (!result.success) {
      return json(
        {
          success: false,
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const note = await updateNote(noteId, userId, result.data);
    if (!note) {
      return json({ error: "Failed to update note" }, { status: 500 });
    }

    return json({ success: true, note });
  }

  return json({ error: "Invalid action" }, { status: 400 });
}

export default function NoteDetailPage() {
  const { note } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const isLoading = navigation.state === "loading";

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      const formData = new FormData();
      formData.append("intent", "delete");
      submit(formData, { method: "post" });
    }
  };

  return (
    <div className="h-full min-h-screen bg-background">
      <div className="container px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        {isLoading ? (
          <NoteDetailSkeleton />
        ) : (
          <NoteDetail note={note} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}