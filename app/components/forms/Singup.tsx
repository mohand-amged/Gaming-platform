"use client";
import React, { startTransition, useTransition } from "react";
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
import { FileUploadDemo } from "../FileUpload";
import { signup } from "@/app/actions/auth";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";

const singupSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(5, { message: "Password must be at least 5 characters" }),
    name: z.string().min(5, { message: "Name must be at least 5 characters" }),
    avatar: z.any(),
    confirmPassword: z.string().min(5, { message: "Password must be at least 5 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
const Singup = () => {
  const form = useForm<z.infer<typeof singupSchema>>({
    resolver: zodResolver(singupSchema),
    defaultValues: {
      password: "",
      email: "",
      name: "",
      avatar: "",
      confirmPassword: "",
    },
  });
  const [isPending, startTransition] = useTransition();
  const onSubmit = async (data: z.infer<typeof singupSchema>) => {
    startTransition(async () => {
      if (data.avatar) {
        const formData = new FormData();
        formData.append("file", data.avatar[0]);
        formData.append("upload_preset", "ml_default");
        try {
          const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL!, {
            method: "POST",
            body: formData,
          });

          console.log(res);
          if (!res.ok) {
            const errorResponse = await res.json(); // Show Cloudinary error details
            console.error("Cloudinary Error:", errorResponse);
            throw new Error("Failed to upload photo");
          }

          const cloudinaryData = await res.json();
          data.avatar = {
            secure_url: cloudinaryData.secure_url,
            public_id: cloudinaryData.public_id,
          };
        } catch (error) {
          console.error("Photo upload failed:", error);
          return;
        }
        const response = await signup(data);
        console.log(response);
        if (response?.success) {
          toast.success(response.success);
          redirect('/login')
        }
        else toast.error(response.error);
      }
    });
  };

  return (
    <MotionItem animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }}>
      <MaxWidthWrapper
        customPadding={" py-14"}
        className=" flex flex-col gap-4 items-center w-full bg-black/60 rounded-2xl border border-input"
      >
        <Logo />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" flex  w-full flex-col gap-6">
            <FileUploadDemo name="avatar" />
            <FormInput name="name" label="Name" type="text" />
            <FormInput name="email" label="Email" type="text" />
            <FormInput name="password" label="Password" type="password" />{" "}
            <FormInput name="confirmPassword" type="password" label="Confirm Password" />
            <Button disabled={isPending} type="submit">
              Submit
            </Button>
          </form>
        </Form>
        <div className="capitalize text-base font-semibold flex items-center gap-2">
          <p className="  text-gray-50 ">Already Have An Account ?!</p>{" "}
          <Link className=" text-rose-500 hover:underline" href={"/login"}>
            Login In to Your Account
          </Link>
        </div>
      </MaxWidthWrapper>
    </MotionItem>
  );
};

export default Singup;
