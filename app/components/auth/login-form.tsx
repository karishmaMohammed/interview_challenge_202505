import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { type LoginForm } from "~/schemas/auth";

interface LoginFormProps {
  redirectTo: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
  isSubmitting: boolean;
}

export function LoginForm({
  redirectTo,
  errors,
  isSubmitting,
}: LoginFormProps) {
  return (
    <Card className="w-full bg-white rounded-3xl shadow-lg border-0">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-3xl font-bold text-center text-gray-800">Welcome back</CardTitle>
        <p className="text-center text-gray-600">
          Enter your email and password to sign in
        </p>
      </CardHeader>
      <CardContent>
        <Form method="post" className="space-y-6">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#c2e7d9] focus:ring-[#c2e7d9] text-gray-800 bg-white"
              aria-describedby={errors?.email ? "email-error" : undefined}
            />
            {errors?.email && (
              <p className="text-sm text-red-500" id="email-error">
                {errors.email[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#c2e7d9] focus:ring-[#c2e7d9] text-gray-800 bg-white"
              aria-describedby={errors?.password ? "password-error" : undefined}
            />
            {errors?.password && (
              <p className="text-sm text-red-500" id="password-error">
                {errors.password[0]}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#c2e7d9] hover:bg-[#afdfd0] text-gray-800 font-semibold py-3 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-[#64b5f6] hover:underline">
              Create one
            </a>
          </p>
        </Form>
      </CardContent>
    </Card>
  );
}
