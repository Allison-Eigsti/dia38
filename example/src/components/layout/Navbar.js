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
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-gray-900">
          Blog
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {isAuthenticated ? (
            <>
              <span className="text-gray-600">Hi, {user.name}</span>
              <Link href="/posts/new" className="text-blue-600 hover:underline">
                New Post
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
              <Link
                href="/register"
                className="text-blue-600 hover:underline"
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
