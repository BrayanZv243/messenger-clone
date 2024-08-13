"use client";

import Avatar from "@/app/components/Avatar";
import ModalLoading from "@/app/components/Modal-Loading";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

interface UserBoxProps {
    data: User;
}

const UserBox = ({ data }: UserBoxProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = useCallback(() => {
        setIsLoading(true);

        axios
            .post("/api/conversations", {
                userId: data.id,
            })
            .then((data) => {
                router.push(`/conversations/${data.data.id}`);
            })
            .catch(() => toast.error("Something went wrong"))
            .finally(() => setIsLoading(false));
    }, [data, router]);
    return (
        <>
            {isLoading && <ModalLoading />}

            <div
                onClick={handleClick}
                className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
            >
                <Avatar user={data} />
                <div className="min-w-0 flex-1">
                    <div className="focus:outline-none">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium text-gray-900">
                                {data.name || ""}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const UserBoxSkeleton = () => {
    return (
        <div className="w-full relative flex items-center space-x-3 rounded-lg p-3">
            <div className="animate-pulse rounded-full bg-gray-200">
                <Skeleton className="w-12 h-12" /> {/* AVATAR */}
            </div>
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <div className="flex justify-between mb-0">
                        <div className="bg-gray-200 rounded-md w-3/4 md:w-3/4 xl:w-3/4 sm:w-1/4  animate-pulse">
                            <Skeleton className="w-full h-5" /> {/* NAME */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserBox;
