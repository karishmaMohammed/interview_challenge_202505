import { Link, Form, useNavigation } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type Note } from "~/db/schema";
import { formatRelativeTime } from "~/utils/date";
import { Star } from "lucide-react";

type SerializedNote = Omit<Note, "createdAt"> & { createdAt: string };

interface NoteCardProps {
  note: SerializedNote;
}

export function NoteCard({ note }: NoteCardProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isToggling = isSubmitting && navigation.formAction?.includes(`/notes/${note.id}/toggle-favorite`);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-none">
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-2">
            <Link to={`/notes/${note.id}`} className="hover:underline">
              {note.title}
            </Link>
          </CardTitle>
          <Form method="post" action={`/notes/${note.id}/toggle-favorite`}>
            <button
              type="submit"
              className="ml-2 text-yellow-500 hover:text-yellow-600 transition-colors disabled:opacity-50"
              title={note.isFavorite ? "Unstar" : "Star"}
              disabled={isToggling}
            >
              <Star
                className={`h-5 w-5 transition-colors ${
                  note.isFavorite ? "fill-yellow-500" : "fill-none"
                }`}
              />
            </button>
          </Form>
        </div>
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
      </CardFooter>
    </Card>
  );
}
