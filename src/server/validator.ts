import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().nonempty()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().nonempty()
});


