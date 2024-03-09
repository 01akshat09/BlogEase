import z from "zod";
export const signupInput = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export const createPostInput = z.object({
  title: z.string(),
  content: z.string(),
});

export const updatePostInput = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export type SigninType = z.infer<typeof signinInput>;
export type SignupType = z.infer<typeof signupInput>;
export type createPostType = z.infer<typeof createPostInput>;
export type updatePostType = z.infer<typeof updatePostInput>;
