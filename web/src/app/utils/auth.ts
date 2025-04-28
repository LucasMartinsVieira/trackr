import { baseUrlApi } from "./url";

interface IRegisterUser {
  name: string;
  email: string;
  password: string;
}

export async function registerUser({ name, email, password }: IRegisterUser) {
  const req = await fetch(`${baseUrlApi()}/auth/register`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      accept: "*/*",
    },
    body: JSON.stringify({ name, email, password, role: "USER" }),
  });

  const data = await req.json();

  return { data, status: req.status };
}

export async function loginUser({
  email,
  password,
}: Omit<IRegisterUser, "name">) {
  const req = await fetch(`${baseUrlApi()}/auth/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      accept: "*/*",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await req.json();

  return { data, status: req.status };
}
