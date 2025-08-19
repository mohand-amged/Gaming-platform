"use client";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormInput from "../FormInput";
import MotionItem from "../defaults/MotionItem";
import MaxWidthWrapper from "../defaults/MaxWidthWrapper";
import Logo from "../defaults/Logo";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(5, { message: "Password must be at least 5 characters" }),
});

const Login = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });
  const [isPending, startTransition] = useTransition();
  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    console.log(data);
    startTransition(async () => {
      const res = await login(data);
      console.log(res);
      if (res.success) {
        toast.success(res.success);
        redirect("/");
      } else toast.error(res.error);
    });
  };
  return (
    <MotionItem animate={{ opacity: 1, y: 0, transition: { duration: 1 } }} initial={{ opacity: 0, y: 100 }}>
      <MaxWidthWrapper
        customPadding={" py-14"}
        className=" flex flex-col gap-4 items-center w-full bg-black/60 rounded-2xl border border-input"
      >
        <Logo />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" flex  w-full flex-col gap-6">
            <FormInput name="email" label="Email" type="text" />
            <FormInput name="password" label="Password" type="password" />

            <Button disabled={isPending} type="submit">
              Submit
            </Button>
          </form>
        </Form>
        <div className="capitalize text-base font-semibold flex items-center gap-2">
          <p className=" text-gray-50 ">Do not have an account ?!</p>{" "}
          <Link className=" text-rose-500 hover:underline" href={"/signup"}>
            Register With Us Now !
          </Link>
        </div>
      </MaxWidthWrapper>
    </MotionItem>
  );
};

export default Login;
