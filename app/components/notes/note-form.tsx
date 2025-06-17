import { useEffect, useRef } from "react";
import { Form, useActionData, useNavigation, Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { type NoteForm } from "~/schemas/notes";
import { type Note } from "~/db/schema";

type SerializedNote = Omit<Note, "createdAt"> & { createdAt: string };

interface NoteFormProps {
  defaultValues?: Partial<NoteForm>;
  note?: SerializedNote;
  onSuccess?: () => void;
}

export function NoteForm({ defaultValues = {}, note, onSuccess }: NoteFormProps) {
  const actionData = useActionData<{
    success: boolean;
    errors?: Record<string, string[]>;
  }>();
  const navigation = useNavigation();
  const formRef = useRef<HTMLFormElement>(null);

  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.success) {
      formRef.current?.reset();
      onSuccess?.();
    }
  }, [actionData?.success, onSuccess]);

  return (
    <Form ref={formRef} method="post" className="space-y-4">
      {note && <input type="hidden" name="intent" value="update" />}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={note?.title || defaultValues.title}
          required
          maxLength={255}
          className="focus:border-[#c2e7d9] focus:ring-[#c2e7d9]"
          aria-invalid={actionData?.errors?.title ? true : undefined}
          aria-errormessage={actionData?.errors?.title?.join(", ")}
        />
        {actionData?.errors?.title && (
          <p className="text-sm text-red-500" id="title-error">
            {actionData.errors.title.join(", ")}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={note?.description || defaultValues.description}
          required
          rows={5}
          maxLength={10000}
          placeholder="Write your note here..."
          className="focus:border-[#c2e7d9] focus:ring-[#c2e7d9]"
          aria-invalid={actionData?.errors?.description ? true : undefined}
          aria-errormessage={actionData?.errors?.description?.join(", ")}
        />
        {actionData?.errors?.description && (
          <p className="text-sm text-red-500" id="description-error">
            {actionData.errors.description.join(", ")}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#c2e7d9] text-gray-800 hover:bg-[#afdfd0] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-semibold rounded-xl"
        >
          {isSubmitting ? "Saving..." : note ? "Update Note" : "Save Note"}
        </Button>
        <Link
          to="/notes"
          className="inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#ffd7d7] text-gray-800 hover:bg-[#ffc7c7] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 h-10 px-4 py-2"
        >
          Cancel
        </Link>
      </div>
    </Form>
  );
}
