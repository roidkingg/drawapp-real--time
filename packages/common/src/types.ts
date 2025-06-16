import { z } from "zod";



export const CreateUserSchema = z.object({
  email: z.string().email("Invalid email"), // 👈 THIS IS CRITICAL
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required")
})


export const SigninSchema = z.object({
    email: z.string().min(3).max(20),
    password: z.string(),
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20),
})
