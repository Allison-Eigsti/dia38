import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { dataResponse, errorResponse } from "@/lib/http";
import { registerSchema, firstZodMessage } from "@/lib/validation";
import { setAuthCookie } from "@/lib/cookies";
import { User } from '@/models/User'

export async function POST(request) {
    let body
    try {
        body = await request.json()
    } catch {
        return errorResponse('Request body must be valid JSON', 400)
    }

    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
        return errorResponse(firstZodMessage(parsed.error), 400)
    }

    const { name, email, password } = parsed.data

    try {
        await connectToDatabase()

        const existing = await User.findOne({ email })
        if (existing) {
            return errorResponse('An account with this email already exists', 409)
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, passwordHash });

        const response = dataResponse(
        { user: { id: user._id.toString(), name: user.name, email: user.email } },
        201
        )
        setAuthCookie(response, user._id);
        return response;
    } catch (error) {
        console.error('Register failed', error)
        return errorResponse('Something went wrong, please try again.', 500)
    }
}