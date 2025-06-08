import { Link } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type Note } from "~/db/schema";
import { formatRelativeTime } from "~/utils/date";

type SerializedNote = Omit<Note, "createdAt"> & { createdAt: string };

interface NoteCardProps {
  note: SerializedNote;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-none">
        <CardTitle className="line-clamp-2">
          <Link to={`/notes/${note.id}`} className="hover:underline">
            {note.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {note.description || ""}
        </p>
      </CardContent>
      <CardFooter className="flex-none border-t pt-4">
        <p className="text-xs text-muted-foreground">
          {formatRelativeTime(note.createdAt)}
        </p>
      
        <Form method="post" action={`/notes/${note.id}/toggle-favorite`}>
          <button
            type="submit"
            className="ml-auto text-yellow-500 hover:text-yellow-600"
            title={note.isFavorite ? "Unstar" : "Star"}
          >
            {note.isFavorite ? "⭐" : "☆"}
          </button>
        </Form>

      </CardFooter>
    </Card>
  );
}
