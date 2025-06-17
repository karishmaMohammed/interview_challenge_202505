import { type Note } from "~/db/schema";
import { formatDate } from "~/utils/date";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { NoteForm } from "./note-form";
import { TrashIcon, Pencil1Icon } from "@radix-ui/react-icons";

type SerializedNote = Omit<Note, "createdAt"> & { createdAt: string };

interface NoteDetailProps {
  note: SerializedNote;
  onDelete: () => void;
}

export function NoteDetail({ note, onDelete }: NoteDetailProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Edit Note</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(false)}
            className="bg-[#ffd7d7] text-gray-800 hover:bg-[#ffc7c7] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 rounded-xl"
          >
            Cancel
          </Button>
        </CardHeader>
        <CardContent>
          <NoteForm
            note={note}
            onSuccess={() => {
              setIsEditing(false);
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription>Created {formatDate(note.createdAt)}</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="bg-[#c2e7d9] text-gray-800 hover:bg-[#afdfd0] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 rounded-xl"
          >
            <Pencil1Icon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="bg-[#ffd7d7] text-gray-800 hover:bg-[#ffc7c7] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 rounded-xl"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {note.description || ""}
        </p>
      </CardContent>
    </Card>
  );
}
