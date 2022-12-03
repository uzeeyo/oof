import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string({ required_error: "Username is required." })
    .min(4, { message: "Username must be at least 4 characters long" }),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, { message: "Password must be at least 6 characters long/" }),
});

export const registrationSchema = z.object({
  username: z
    .string({ required_error: "Username is required." })
    .min(4, { message: "Username must be at least 4 characters long" }),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, { message: "Password must be at least 6 characters long/" }),
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Email must be in email format." })
    .min(6),
});

export const reportSchema = z.object({
  text: z
    .string({ required_error: "Username is required." })
});

export const postSchema = z.object({
  text: z
    .string({ required_error: "Username is required." })
    .min(4, { message: "Username must be at least 4 characters long" }),
});

export const commentSchema = z.object({
  text: z
    .string({ required_error: "Username is required." })
    .min(4, { message: "Username must be at least 4 characters long" }),
});

export const settingsSchema = z.object({
  darkMode: z.boolean(),
  desktopNotify: z.boolean(),
  mobileNotify: z.boolean(),
  usernameVisibleOnPosts: z.boolean(),
  usernameVisibleOnComments: z.boolean(),
  showPorn: z.boolean(),
  showViolence: z.boolean(),
});
