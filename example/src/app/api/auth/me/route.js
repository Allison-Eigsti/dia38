import { getAuthenticatedUser } from "@/lib/auth";
import { dataResponse, errorResponse } from "@/lib/http";

// The browser calls this on app load. It sends the HTTP-only cookie
// automatically, we verify the JWT, and return the current user.
// This is how the session survives a page refresh even though React
// state is reset.
export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return errorResponse("Not authenticated", 401);
  }
  return dataResponse({
    user: { id: user._id.toString(), name: user.name, email: user.email },
  });
}
