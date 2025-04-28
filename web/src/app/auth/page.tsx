"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";
import { login, register } from "@/app/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { LoginFormState, RegisterFormState } from "@/app/lib/definitions";
import { useAuthContext } from "@/components/providers/auth-provider";

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [loginState, loginAction] = useActionState<LoginFormState, FormData>(
    login,
    {
      errors: {},
    },
  );
  const [registerState, registerAction] = useActionState<
    RegisterFormState,
    FormData
  >(register, { errors: {} });

  function SubmitButton({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus();
    const { isLoggedIn, setLoggedIn } = useAuthContext();

    return (
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        onClick={() => {
          setLoggedIn(!isLoggedIn);
        }}
        disabled={pending}
      >
        {pending ? "Processing..." : children}
      </Button>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Book className="mx-auto h-10 w-10 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to BookTracker
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account or create a new one
          </p>
        </div>

        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <form action={loginAction}>
                <div className="space-y-4">
                  <CardContent className="space-y-4">
                    {loginState.errors?._form && (
                      <Alert variant="destructive" className="text-sm py-2">
                        <AlertDescription>
                          {loginState.errors._form[0]}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        aria-describedby="email-error"
                      />
                      {loginState.errors?.email && (
                        <p id="email-error" className="text-sm text-red-500">
                          {loginState.errors.email[0]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          aria-describedby="password-error"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                      {loginState.errors?.password && (
                        <p id="password-error" className="text-sm text-red-500">
                          {loginState.errors.password[0]}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <SubmitButton>Sign In</SubmitButton>
                  </CardFooter>
                </div>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>
                  Create a new account to start tracking your books
                </CardDescription>
              </CardHeader>
              <form action={registerAction}>
                <div className="space-y-4">
                  <CardContent className="space-y-4">
                    {registerState.errors?._form && (
                      <Alert variant="destructive" className="text-sm py-2">
                        <AlertDescription>
                          {registerState.errors._form[0]}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        aria-describedby="name-error"
                      />
                      {registerState.errors?.name && (
                        <p id="name-error" className="text-sm text-red-500">
                          {registerState.errors.name[0]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        aria-describedby="register-email-error"
                      />
                      {registerState.errors?.email && (
                        <p
                          id="register-email-error"
                          className="text-sm text-red-500"
                        >
                          {registerState.errors.email[0]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          aria-describedby="register-password-error"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                      {registerState.errors?.password && (
                        <p
                          id="register-password-error"
                          className="text-sm text-red-500"
                        >
                          {registerState.errors.password[0]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          aria-describedby="confirm-password-error"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="sr-only">
                            {showConfirmPassword
                              ? "Hide password"
                              : "Show password"}
                          </span>
                        </Button>
                      </div>
                      {registerState.errors?.confirmPassword && (
                        <p
                          id="confirm-password-error"
                          className="text-sm text-red-500"
                        >
                          {registerState.errors.confirmPassword[0]}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <SubmitButton>Create Account</SubmitButton>
                  </CardFooter>
                </div>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            {activeTab === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              type="button"
              className="underline text-primary hover:text-primary/90"
              onClick={() =>
                setActiveTab(activeTab === "login" ? "register" : "login")
              }
            >
              {activeTab === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
