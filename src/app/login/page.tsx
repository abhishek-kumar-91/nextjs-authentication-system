import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { CredentialsSignin } from "next-auth";
import { signIn } from "@/auth";
import { toast } from "sonner";
import { redirect } from "next/navigation";

function page() {
  const loginHandler = async (formData: FormData) => {
    "use server";
    const email = formData.get("email") as string | undefined;
    const password = formData.get("password") as string | undefined;

    if (!email || !password) {
      toast.error("Please provide all field");
    }

    try {
      await signIn("credentials", {
        email,
        password,
      });
    } catch (err) {
      const errr = err as CredentialsSignin;
      return errr.message;
    }
  };

  return (
    <div className="flex justify-center items-center h-dvh">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={loginHandler} className="flex flex-col gap-4">
            <Input type="email" placeholder="Email.." name="email" />
            <Input type="password" placeholder="Password.." name="password" />
            <Button type="submit">Login</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <span>Or</span>
          <form action={
            async() => {
              "use server"
              await signIn("google");
            }
          }>
            <Button type="submit" variant={"outline"}>
              Login with Google
            </Button>
          </form>

          <p>
            If you don't have an account{" "}
            <Link href="/signup" className="text-blue-400 hover:underline">
              SignUp
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default page;
