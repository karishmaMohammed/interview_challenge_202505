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
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";

type SerializedNote = Omit<Note, "createdAt"> & { createdAt: string };

interface NoteCardProps {
  note: SerializedNote;
}

export function NoteCard({ note }: NoteCardProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isToggling = isSubmitting && navigation.formAction?.includes(`/notes/${note.id}/toggle-favorite`);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      const form = document.createElement("form");
      form.method = "post";
      form.action = `/notes/${note.id}`;
      
      const intentInput = document.createElement("input");
      intentInput.type = "hidden";
      intentInput.name = "intent";
      intentInput.value = "delete";
      
      form.appendChild(intentInput);
      document.body.appendChild(form);
      form.submit();
    }
  };

  return (
    <Card className="flex h-full flex-col border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md rounded-xl overflow-hidden">
      <CardHeader className="flex-none border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-2">
            <Link to={`/notes/${note.id}`} className="hover:underline">
              {note.title}
            </Link>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Form method="post" action={`/notes/${note.id}/toggle-favorite`}>
              <button
                type="submit"
                className="text-yellow-500 hover:text-yellow-600 transition-colors disabled:opacity-50"
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
            <Link to={`/notes/${note.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="bg-[#c2e7d9] text-gray-800 hover:bg-[#afdfd0] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 rounded-xl border border-gray-300"
              >
                <Pencil1Icon className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="bg-[#ffd7d7] text-gray-800 hover:bg-[#ffc7c7] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 rounded-xl border border-gray-300"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 border-b border-gray-200">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {note.description || ""}
        </p>
      </CardContent>
      <CardFooter className="flex-none pt-4 bg-gray-50">
        <p className="text-xs text-muted-foreground">
          {formatRelativeTime(note.createdAt)}
        </p>
      </CardFooter>
    </Card>
  );
}
