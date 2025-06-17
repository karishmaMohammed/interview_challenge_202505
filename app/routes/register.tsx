import { json, type ActionFunctionArgs } from "@remix-run/node";
import { useActionData, useNavigation } from "@remix-run/react";
import { RegisterForm } from "~/components/auth/register-form";
import { createUser, getUserByEmail } from "~/services/auth.server";
import { createUserSession } from "~/services/session.server";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/notes";

  try {
    // Validate form data
    const validatedData = RegisterSchema.parse({
      email,
      password,
      confirmPassword,
    });

    // Check if user already exists
    const existingUser = await getUserByEmail(validatedData.email);
    if (existingUser) {
      return json(
        {
          errors: {
            email: ["A user with this email already exists"],
          },
        },
        { status: 400 }
      );
    }

    // Create new user
    const user = await createUser(validatedData.email, validatedData.password);

    // Create session and redirect
    return createUserSession(user.id, redirectTo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.flatten().fieldErrors;
      return json({ errors }, { status: 400 });
    }

    console.error("Registration error:", error);
    return json(
      {
        errors: {
          email: ["An error occurred during registration"],
        },
      },
      { status: 500 }
    );
  }
}

export default function RegisterPage() {
  const actionData = useActionData<{
    errors?: { email?: string[]; password?: string[]; confirmPassword?: string[] };
  }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#fff5eb] to-[#ffedd5] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#e6f7f0] rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#fff5eb] rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -top-10 left-1/3 w-32 h-32 bg-[#e6f7f0] rounded-full blur-2xl opacity-30"></div>
      </div>
      
      {/* Main content */}
      <div className="w-full max-w-md space-y-8 z-10">
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-bold text-[#64b5f6]">Notes</h1>
        </div>
        <RegisterForm
          errors={actionData?.errors}
          isSubmitting={isSubmitting}
          redirectTo="/notes"
        />
      </div>
    </div>
  );
} 