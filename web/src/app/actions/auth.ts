"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  type LoginFormState,
  loginSchema,
  RegisterFormState,
  registerSchema,
} from "@/app/lib/definitions";

export async function login(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error?.flatten().fieldErrors,
      message: "Invalid form data. Please check the fields above",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // TODO: add real implementation of this
    if (email === "demo@example.com" && password === "password123") {
      const cookieStore = await cookies();
      cookieStore.set("auth-token", "demo-token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });

      redirect("/books");
    }

    return {
      errors: {
        _form: ["Invalid email or password. Please try again."],
      },
      success: false,
    };
  } catch (error) {
    return {
      errors: {
        _form: ["An unexpected error occured. Please try again."],
      },
      success: false,
    };
  }
}

export async function register(
  _prevState: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> {
  const validatedFields = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid form data. Plase check the fields above.",
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // TODO: add real implementation of this
    if (email === "demo@example.com") {
      return {
        errors: {
          email: ["This email is already in use. Please try another."],
        },
        success: false,
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("auth-token", "new-user-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    redirect("/books");
  } catch (error) {
    return {
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
      success: false,
    };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  redirect("/auth");
}
