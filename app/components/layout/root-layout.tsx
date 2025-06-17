import { Link, NavLink, useLocation, Form } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

interface RootLayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

export function RootLayout({ children, isAuthenticated }: RootLayoutProps) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login";

  if (isAuthPage || !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex flex-1 items-center justify-center">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-gradient-to-r from-[#fff5eb] via-[#e6f7f0] to-[#fff5eb] shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-[#64b5f6] hover:text-[#4a9de0] transition-colors"
          >
            Notes App
          </Link>

          <nav className="flex items-center gap-6">
            <NavLink
              to="/notes"
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-[#64b5f6]",
                  isActive ? "text-[#64b5f6] font-semibold" : "text-gray-600"
                )
              }
            >
              Notes
            </NavLink>
            <Form action="/logout" method="post">
              <Button 
                variant="ghost" 
                type="submit"
                className="text-gray-600 hover:text-[#64b5f6] hover:bg-[#e6f7f0]/50"
              >
                Logout
              </Button>
            </Form>
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-br from-[#fff5eb] to-[#ffedd5]">
        <div className="container py-8">{children}</div>
      </main>

      <footer className="border-t bg-white py-6">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Notes App. All rights reserved.
          </p>
          <nav className="flex items-center gap-4">
            <Link
              to="/terms"
              className="text-sm text-gray-600 hover:text-[#64b5f6] transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-gray-600 hover:text-[#64b5f6] transition-colors"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
