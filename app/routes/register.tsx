import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createUser, getUserByEmail } from "~/services/user.server";
import { createUserSession } from "~/services/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  if (!email || !password) {
    return json({ error: "Email and password are required." }, { status: 400 });
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json({ error: "User already exists." }, { status: 400 });
  }

  const user = await createUser(email, password);
  return createUserSession(user.id, "/notes");
}

export default function RegisterPage() {
  const data = useActionData<typeof action>();

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Register</h1>
      <Form method="post" className="space-y-4">
        {data?.error && <p className="text-red-500">{data.error}</p>}
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          className="w-full border rounded p-2"
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          className="w-full border rounded p-2"
        />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Register
        </button>
      </Form>
    </div>
  );
}
