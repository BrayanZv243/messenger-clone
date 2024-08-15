"use client";

import Image from "next/image";
import AuthForm from "./components/AuthForm";
import ModalLoading from "../components/Modal-Loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const { status } = useSession();
    const router = useRouter();
    useEffect(() => {
        if (status === "authenticated") {
            const delayRedirect = setTimeout(() => {
                router.push("/users");
            }, 1000);

            return () => clearTimeout(delayRedirect);
        }
    }, [status, router]);

    if (status === "loading" || status === "authenticated") {
        return <ModalLoading />;
    }
    return (
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Image
                    alt="Logo"
                    height="48"
                    width="48"
                    className="mx-auto w-auto"
                    src="/images/logo.png"
                />
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>
            <AuthForm />
        </div>
    );
}
