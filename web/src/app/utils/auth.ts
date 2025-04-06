interface IRegisterUser {
  name: string;
  email: string;
  password: string;
}

export async function registerUser({ name, email, password }: IRegisterUser) {
  // TODO: use next router when possible
  // const req = await fetch("/auth/api/register", {
  const req = await fetch(`http://localhost:3000/auth/api/register`, {
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
  const req = await fetch(`http://localhost:3000/auth/api/login`, {
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
