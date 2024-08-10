"use client";

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import UserAvatarDefault from "@/components/UserAvatarDefault";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import ImageModal from "./ImageModal";
import { Skeleton } from "@/components/ui/skeleton";

interface MessageBoxProps {
    data: FullMessageType;
    isLast: boolean;
}

const MessageBox = ({ isLast, data }: MessageBoxProps) => {
    const session = useSession();
    const [imageModalOpen, setImageModalOpen] = useState(false);

    const isOwn = session?.data?.user?.email === data.sender.email;
    const seenList = (data.seen || [])
        .filter((user) => user.email !== data?.sender?.email)
        .map((user) => user.name)
        .join(", ");

    const container = clsx(`flex gap-3 p-4`, isOwn && "justify-end");
    const avatar = clsx(isOwn && "order-2");

    const body = clsx("flex flex-col gap-0 -mt-[16px]", isOwn && "items-end");

    const message = clsx(
        "text-sm w-fit overflow-hidden",
        isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
        data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
    );

    return (
        <div className={container}>
            <div className={avatar}>
                <Avatar user={data.sender} />
            </div>
            <div className={body}>
                <div className="flex items-center gap-1">
                    <div className="text-sm text-gray-500">
                        {data.sender.name}
                    </div>
                    <div className="text-xs text-gray-400">
                        {format(new Date(data.createdAt), "p")}
                    </div>
                </div>
                <div className={message}>
                    <ImageModal
                        src={data.image}
                        isOpen={imageModalOpen}
                        onClose={() => setImageModalOpen(false)}
                    />
                    {data.image ? (
                        <Image
                            onClick={() => setImageModalOpen(true)}
                            alt="Image"
                            height={228}
                            width={228}
                            src={data.image}
                            className="object-cover cursor-pointer hover:scale-125 transition translate w-auto h-auto"
                        />
                    ) : (
                        <div>{data.body}</div>
                    )}
                </div>
                {isLast && isOwn && seenList.length > 0 && (
                    <div className="text-xs font-light text-gray-500">{`Seen by ${seenList}`}</div>
                )}
            </div>
        </div>
    );
};

interface MessageBoxSkeletonProps {
    number: number;
}

export const MessageBoxSkeleton = ({ number }: MessageBoxSkeletonProps) => {
    // To simulate own messages
    const isOwn = !!(number % 2);

    return (
        <div className={clsx(`flex gap-3 p-4`, number % 2 && "justify-end")}>
            <div
                className={clsx(
                    "w-9 h-9 rounded-full bg-gray-200 animate-pulse",
                    isOwn && "order-2 bg-sky-300"
                )}
            >
                <Skeleton />
            </div>
            <div
                className={clsx(
                    "flex flex-col gap-0 -mt-[16px]",
                    isOwn && "items-end"
                )}
            >
                <div
                    className={clsx(
                        `flex items-center gap-1 w-full animate-pulse mb-2`,
                        isOwn && "justify-end"
                    )}
                >
                    <div
                        className={clsx(
                            `w-1/2 xl:w-1/5 lg:w-1/6 md:w-1/3 h-4 bg-gray-200 rounded-full`,
                            isOwn && "bg-sky-200"
                        )}
                    >
                        <Skeleton />
                    </div>
                    <div
                        className={clsx(
                            `w-1/6 xl:w-1/12 lg:w-1/12 h-4 bg-gray-200 rounded-full`,
                            isOwn && "bg-sky-200"
                        )}
                    >
                        <Skeleton />
                    </div>
                </div>
                <div
                    className={clsx(
                        "w-40 lg:w-80 xl:w-80 animate-pulse rounded-full",
                        isOwn ? "bg-sky-500 text-white" : "bg-gray-200"
                    )}
                >
                    <div className="animate-pulse w-full h-12 ">
                        <Skeleton /> {/* BODY MESSAGE */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageBox;
