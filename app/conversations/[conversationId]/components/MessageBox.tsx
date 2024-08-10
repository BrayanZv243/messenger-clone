"use client";

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import ImageModal from "./ImageModal";
import { Skeleton } from "@/components/ui/skeleton";
import FileIcon, { FileType, is_Image } from "@/app/components/FileIcon";
import { FaDownload } from "react-icons/fa";
import ProfileDrawer from "./ProfileDrawer";
import { User } from "@prisma/client";
import useConversation from "@/app/hooks/useConversation";
import useOtherUser from "@/app/hooks/useOtherUser";
import ProfileDrawerUser from "./ProfileDrawerUser";

interface MessageBoxProps {
    data: FullMessageType;
    isLast: boolean;
}

const MessageBox = ({ isLast, data }: MessageBoxProps) => {
    const session = useSession();
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [isFormatImage, setIsFormatImage] = useState(false);
    const [fileType, setFileType] = useState<FileType | null>(null);
    const [fileName, setFileName] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);

    const isOwn = session?.data?.user?.email === data.sender.email;
    const seenList = (data.seen || [])
        .filter((user) => user.email !== data?.sender?.email)
        .map((user) => user.name)
        .join(", ");

    const container = clsx(`flex gap-3 p-4`, isOwn && "justify-end");
    const avatar = clsx(
        "cursor-pointer hover:opacity-50 transition-opacity",
        isOwn && "order-2"
    );
    const body = clsx("flex flex-col gap-0 -mt-[16px]", isOwn && "items-end");
    const message = clsx(
        "relative text-sm w-fit overflow-hidden",
        isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
        data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
    );

    useEffect(() => {
        if (data.image) {
            const extractFileNameFromUrl = (url: string) => {
                const parts = url.split("/");
                const lastPart = parts.pop()!.split(".");
                const lastIndex = lastPart[0].lastIndexOf("_");

                const fileName = lastPart[0].substring(0, lastIndex);
                if (!fileName) return "File";
                return fileName;
            };

            setFileName(extractFileNameFromUrl(data.image));

            const fileType = data.image.split(".").pop() as FileType;
            setFileType(fileType);
            setIsFormatImage(is_Image(fileType));
        }
    }, [data.image]);

    const handleDownload = async () => {
        const response = await fetch(data.image!);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName}.${fileType}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <ProfileDrawerUser
                user={data.sender}
                isOwn={isOwn}
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
            <div className={container}>
                <div className={avatar} onClick={() => setDrawerOpen(true)}>
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
                        {isFormatImage && (
                            <>
                                <ImageModal
                                    src={data.image}
                                    isOpen={imageModalOpen}
                                    onClose={() => setImageModalOpen(false)}
                                />

                                <Image
                                    onClick={() => setImageModalOpen(true)}
                                    alt="Image"
                                    height={228}
                                    width={228}
                                    src={data.image!}
                                    className="object-cover cursor-pointer hover:scale-125 transition translate w-auto h-auto "
                                />
                                <div onClick={handleDownload}>
                                    <div className="absolute bottom-2 right-2 bg-gray-200 cursor-pointer rounded-md p-0.5 opacity-60 hover:opacity-100 transition-opacity">
                                        <FaDownload fill="black" />
                                    </div>
                                </div>
                            </>
                        )}
                        {fileType && !isFormatImage && (
                            <>
                                <div className="w-full flex justify-center hover:scale-125 transition">
                                    <div onClick={handleDownload}>
                                        <FileIcon
                                            type={fileType}
                                            className="w-28 h-28 cursor-pointer mt-4"
                                        />
                                    </div>
                                </div>
                                <p className="text-sm leading-3 p-2">
                                    {fileName}.{fileType}
                                </p>
                            </>
                        )}
                        {data.body}
                    </div>
                    {isLast && isOwn && seenList.length > 0 && (
                        <div className="text-xs font-light text-gray-500">{`Seen by ${seenList}`}</div>
                    )}
                </div>
            </div>
        </>
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
