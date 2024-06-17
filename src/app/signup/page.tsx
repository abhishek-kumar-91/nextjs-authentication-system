import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { User } from "@/models/userModel";
import {hash} from "bcryptjs"
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/utils";


function page() {
    const signup = async(formData: FormData) => {
        "use server";
        const name = formData.get("name") as string | undefined;
        const email = formData.get("email") as string | undefined;
        const password = formData.get("password") as string | undefined;

        if(!email || !password || !name){
            throw new Error("Please provide all fields");
        }
        //database connection

        await connectToDatabase();
        const user = await User.findOne({email});

        if(user){
                throw new Error("User already exist");
        }

        const hashedPassword = await hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword
        });

      redirect("/login");
  };
  return (
    <div className="flex justify-center items-center h-dvh">
    <Card>
      <CardHeader>
        <CardTitle>Signup</CardTitle>
      </CardHeader>
      <CardContent >
      <form action={signup} 
      className="flex flex-col gap-4">
      <Input type="text" placeholder="Full Name.." name="name"/>
      <Input type="email" placeholder="Email.." name="email"/>
       <Input type="password" placeholder="Password.." name="password" />
       <Button type="submit">Signup</Button>
      </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <span>Or</span>
        <form action="">
          <Button type="submit" variant={"outline"}>Login with Google</Button>
        </form>

        <p>Already have an account <Link href="/login" className="text-blue-400 hover:underline">LogIn</Link></p>
      </CardFooter>
    </Card>
  </div>
  )
}

export default page