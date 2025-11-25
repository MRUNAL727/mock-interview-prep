"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { signIn } from "@/lib/actions/auth.actions";

const authFormaSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.email(),
    password: z.string().min(6),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const formSchema = authFormaSchema(type);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        // const result = await signUp({
        //   uid: userCredentials.user.uid,
        //   name: name!,
        //   email,
        //   password
        // })

        const result: any = await fetch("/api/sign-up", {
          method: "POST",
          body: JSON.stringify({
            uid: userCredentials.user.uid,
            name,
            email,
            password,
          }),
        });

        if (!result?.success) {
          toast.error(result?.message || "Failed to create an account.");
          return;
        }

        toast.success("Account created successefully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const idToken = await userCredentials.user.getIdToken();

        if (!idToken) {
          toast.error("Failed to sign in.");
          return;
        }

        await signIn({ idToken, email });

        toast.success("Signed in successfully!");
        router.push("/");
      }
    } catch (error: any) {
      console.log(error.message);
      toast.error(`There was an error: ${error.message}`);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-width-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="Logo" width={32} height={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>
        <h3>Practice job interview with AI</h3>
        <Card className="w-full sm:max-w-md">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your profile information below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="form w-full space-y-6 mt-4"
              id="form-rhf-input"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="name"
                  label="Name"
                  placeholder="Name"
                  type="text"
                />
              )}
              <FormField
                control={form.control}
                name="email"
                label="Email"
                placeholder="Email Addresss"
                type="email"
              />
              <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Password"
                type="password"
              />

              <Button className="btn" type="submit">
                {isSignIn ? "Sign In" : "Create an account"}
              </Button>
            </form>
          </CardContent>
          <p className="text-center">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}
            <Link
              href={!isSignIn ? "/sign-in" : "/sign-up"}
              className="font-bold text-user-primary ml-1"
            >
              {!isSignIn ? "Sign In" : "Sign Up"}
            </Link>
          </p>
          {/* <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" form="form-rhf-input">
              Save
            </Button>
          </Field>
        </CardFooter> */}
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;
