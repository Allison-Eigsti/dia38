import { getAuthenticatedUser } from "@/lib/auth";
import { dataResponse, errorResponse } from "@/lib/http";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return errorResponse("Not authenticated", 401);
  }
  return dataResponse({
    user: { id: user._id.toString(), name: user.name, email: user.email },
  });
}
