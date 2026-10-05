"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-gray-100 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-gray-900 transition-colors hover:text-gray-700"
        >
          Blog
        </Link>

        <div className="flex items-center gap-5 text-sm">
          {isAuthenticated ? (
            <>
              <span className="hidden text-gray-500 sm:inline">
                Hi, {user.name}
              </span>

              <Link
                href="/posts/new"
                className="rounded-md bg-gray-900 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
              >
                New Post
              </Link>

              <button
                onClick={handleLogout}
                className="font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-md bg-gray-900 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

