"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  type LoginFormState,
  loginSchema,
  RegisterFormState,
  registerSchema,
} from "@/app/lib/definitions";
import { loginUser, registerUser } from "../utils/auth";

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
    const { data, status } = await loginUser({ email, password });

    if (status !== 200) {
      return {
        errors: {
          _form: ["Invalid email or password. Please try again."],
        },
        success: false,
      };
    }

    const cookieStore = await cookies();

    cookieStore.set("auth-token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
  } catch (error) {
    console.log(error);
    return {
      errors: {
        _form: ["An unexpected error occured. Please try again."],
      },
      success: false,
    };
  }

  redirect("/books");
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
    const { data, status } = await registerUser({ name, email, password });

    if (status !== 200) {
      return {
        errors: {
          _form: ["An unexpected error occurred in the API. Please try again."],
        },
        success: false,
      };
    }

    const cookieStore = await cookies();

    cookieStore.set("auth-token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
  } catch (error) {
    console.log(error);
    return {
      errors: {
        _form: ["An unexpected error occurred. Please try again. BOLOLO"],
      },
      success: false,
    };
  }

  // TODO: put inside try catch
  redirect("/books");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  redirect("/auth");
}
