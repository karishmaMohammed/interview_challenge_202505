import { json, type ActionFunctionArgs } from "@remix-run/node";
import { useActionData, useNavigation } from "@remix-run/react";
import { LoginForm } from "~/components/auth/login-form";
import { authenticateUser } from "~/services/auth.server";
import { createUserSession } from "~/services/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/notes";

  // Validate form data
  if (!email || !password) {
    return json(
      {
        errors: {
          email: ["Email is required"],
          password: ["Password is required"],
        },
      },
      { status: 400 }
    );
  }

  try {
    // Authenticate user
    const user = await authenticateUser(email, password);
    if (!user) {
      return json(
        {
          errors: {
            email: ["Invalid email or password"],
          },
        },
        { status: 401 }
      );
    }

    // Create session
    return createUserSession(user.id, redirectTo);
  } catch (error) {
    console.error("Login error:", error);
    return json(
      {
        errors: {
          email: ["An error occurred during login"],
        },
      },
      { status: 500 }
    );
  }
}

export default function LoginPage() {
  const actionData = useActionData<{
    errors?: { email?: string[]; password?: string[] };
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
        <LoginForm
          errors={actionData?.errors}
          isSubmitting={isSubmitting}
          redirectTo="/notes"
        />
      </div>
    </div>
  );
}
