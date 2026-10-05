import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-bold">Not found</h1>
      <p className="mt-2 text-gray-600">
        The page or post you are looking for does not exist.
      </p>
      <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
        Back to posts
      </Link>
    </div>
  );
}
