import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { dataResponse, errorResponse } from "@/lib/http";
import { loginSchema, firstZodMessage } from "@/lib/validation";
import { setAuthCookie } from "@/lib/cookies";
import { User } from "@/models/User";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Request body must be valid JSON", 400);
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(firstZodMessage(parsed.error), 400);
  }

  const { email, password } = parsed.data;

  try {
    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return errorResponse("Invalid email or password", 401);
    }

    const response = dataResponse({
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
    setAuthCookie(response, user._id);
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}
