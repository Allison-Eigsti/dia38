import { dataResponse } from "@/lib/http";
import { clearAuthCookie } from "@/lib/cookies";

export async function POST() {
  const response = dataResponse({ message: "Logged out" });
  clearAuthCookie(response);
  return response;
}
