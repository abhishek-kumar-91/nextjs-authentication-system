import NextAuth, { CredentialsSignin } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { User } from "./models/userModel";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/utils";


//connect with db
//custome page for login and signup

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    CredentialsProvider({
        name: "Credentials",
        credentials:{
            email: {
                label: "Email",
                type: "email",
            },
            password: {
                label: "Password",
                type: "password"
            },


        },
        authorize: async (credentials) => {
            try {
              const email = credentials.email as string | undefined;
              const password = credentials.password as string | undefined;
          console.log(email, password, "auth.js");
              if (!email || !password) {
                throw new CredentialsSignin("Please provide correct email and password");
              }
          
              // Ensure database connection
              await connectToDatabase();
              const user = await User.findOne({ email }).select("+password");
            console.log(user, "user");
              if (!user) {
                throw new CredentialsSignin("Invalid Email or Password");
              }
          
              const isMatch = await bcrypt.compare(password, user.password);
          
              if (!isMatch) {
                throw new CredentialsSignin("Invalid Email or Password");
              }
          
              return { name: user.name, email: user.email, id: user._id.toString() };
            } catch (error) {
             
              throw error; // Ensure the error is propagated correctly
            }
          }
          
          
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    signIn: async({user, account}) => {
        if(account?.provider === "google"){
          try {
            const {email, name, image, id} = user;
            await connectToDatabase();
            const alreadyUser = await User.findOne({email});
            if(!alreadyUser){
              await User.create({
                email, 
                name,
                image,
                googleId:id
              })

              return true;
            }
          } catch (error) {
            throw new Error("google auth");
          }
        }
        return false;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});