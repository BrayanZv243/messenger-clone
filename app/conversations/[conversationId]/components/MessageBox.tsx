import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import {
    differenceInDays,
    differenceInMinutes,
    format,
    formatDistanceToNow,
    isToday,
    isYesterday,
} from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import ImageModal from "./ImageModal";
import { Skeleton } from "@/components/ui/skeleton";
import FileIcon, {
    FileType,
    is_Image,
    truncateFileName,
} from "@/app/components/FileIcon";
import { FaDownload } from "react-icons/fa";
import ProfileDrawerUser from "./ProfileDrawerUser";

interface MessageBoxProps {
    data: FullMessageType;
    previousMessage: FullMessageType | null;
    isLast: boolean;
}

const MessageBox = ({ isLast, data, previousMessage }: MessageBoxProps) => {
    // MINUTES RANGE WITHIN INTERVAL
    const RANGE_MINUTES = 5;

    const session = useSession();
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [isFormatImage, setIsFormatImage] = useState(false);
    const [fileType, setFileType] = useState<FileType | null>(null);
    const [fileName, setFileName] = useState("");
    const [fullFileName, setFullFileName] = useState("");
    const [fileSize, setFileSize] = useState({ size: 0, sizeType: "" });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isWithinInterval, setIsWithinInterval] = useState(false);
    const [isSameSender, setIsSameSender] = useState(false);

    useEffect(() => {
        const isSameSender =
            previousMessage &&
            previousMessage.sender.email === data.sender.email;
        setIsSameSender(!!isSameSender);

        // Only isWithinInterval could be true WHETHER IS THE SAME SENDER, OTHERWISE HAS TO BE FALSE.
        if (isSameSender) {
            // Determine if the message is from the range minutes (RANGE_MINUTES) as the previous message
            const isWithinInterval =
                previousMessage?.createdAt &&
                differenceInMinutes(
                    new Date(data.createdAt),
                    previousMessage.createdAt
                ) <= RANGE_MINUTES;
            setIsWithinInterval(!!isWithinInterval);
        } else {
            setIsWithinInterval(false);
        }
    }, [data, previousMessage]);

    const isOwn = session?.data?.user?.email === data.sender.email;
    const seenList = (data.seen || [])
        .filter((user) => user.email !== data?.sender?.email)
        .map((user) => user.name || "")
        .join(", ");

    const container = clsx(`flex gap-3 p-4`, isOwn && "justify-end");
    const avatar = clsx(isOwn && "order-2");
    const body = clsx("flex flex-col gap-0 -mt-[16px]", isOwn && "items-end");
    const message = clsx(
        "relative text-sm overflow-hidden w-fit h-auto -mb-2",
        (isOwn && data.body) || (fileType && !isFormatImage)
            ? "bg-sky-500 text-gray-100"
            : !isFormatImage && "bg-gray-100",
        data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
    );

    useEffect(() => {
        if (data.image) {
            fetchFileSize(data.image);

            const extractFileNameFromUrl = (url: string) => {
                const parts = url.split("/");
                const lastPart = parts.pop()!.split(".");
                const lastIndex = lastPart[0].lastIndexOf("_");

                const fileName = lastPart[0].substring(0, lastIndex);
                if (!fileName) return "File";
                return fileName;
            };

            const fileNameFromUrl = extractFileNameFromUrl(data.image);

            setFileName(fileNameFromUrl);

            const fileType = data.image.split(".").pop() as FileType;
            setFileType(fileType);
            setIsFormatImage(is_Image(fileType));

            const truncateName = truncateFileName(fileNameFromUrl, "", 40);
            setFullFileName(truncateName);
        }
    }, [data.image]);

    const fetchFileSize = async (fileUrl: string) => {
        try {
            const response = await fetch(fileUrl, {
                method: "HEAD",
            });

            if (!response.ok) {
                console.error("Failed to fetch file headers");
                return null;
            }
            const contentLength = response.headers.get("Content-Length");

            if (!contentLength) {
                console.error("Content-Length header not found");
                return null;
            }

            if (contentLength) {
                const fileSizeInBytes = parseInt(contentLength, 10);
                if (fileSizeInBytes < 1024) {
                    setFileSize({ size: fileSizeInBytes, sizeType: "B" });
                    return;
                }

                const fileSizeInKB = parseInt(
                    (fileSizeInBytes / 1024).toFixed(2)
                );
                if (fileSizeInKB < 1024) {
                    setFileSize({ size: fileSizeInKB, sizeType: "kB" });
                    return;
                }

                const fileSizeInMB = parseInt(
                    (fileSizeInBytes / (1024 * 1024)).toFixed(2)
                );
                setFileSize({ size: fileSizeInMB, sizeType: "MB" });
            }
        } catch (error) {
            console.error("Error fetching file size:", error);
        }
    };

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

    const formatMessageDate = (
        date: Date,
        previousDate: Date | null | undefined
    ) => {
        const now = new Date();
        const daysDifference = differenceInDays(now, date);

        if (previousDate && isWithinInterval) {
            return "";
        }
        if (isToday(date)) {
            return `today at ${format(date, "p")}`;
        } else if (isYesterday(date)) {
            return `yesterday at ${format(date, "p")}`;
        } else if (daysDifference > 1) {
            return `${format(date, "dd/MM/yyyy")} at ${format(date, "p")}`;
        } else {
            return `${formatDistanceToNow(date, {
                addSuffix: true,
            })} at ${format(date, "p")}`;
        }
    };

    return (
        <>
            <>
                <ProfileDrawerUser
                    user={data.sender}
                    isOwn={isOwn}
                    isOpen={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                />
                <div className={container} suppressHydrationWarning>
                    {!isWithinInterval || !isSameSender ? (
                        <div
                            className={clsx(
                                avatar,
                                "rounded-full h-11 w-11 cursor-pointer hover:opacity-50 transition-opacity"
                            )}
                            onClick={() => setDrawerOpen(true)}
                        >
                            <Avatar user={data.sender} />
                        </div>
                    ) : (
                        <div
                            className={clsx(
                                avatar,
                                "w-9 h-9 rounded-full -mt-8 mr-2"
                            )}
                        >
                            <Skeleton />
                        </div>
                    )}
                    <div className={body}>
                        {!isWithinInterval && (
                            <div className="flex items-center gap-1">
                                <div className="text-md text-gray-500 mt-4">
                                    {data.sender.name || ""}
                                </div>
                                <div className="text-xs text-gray-400 mt-5">
                                    {formatMessageDate(
                                        new Date(data.createdAt),
                                        previousMessage?.createdAt
                                    )}
                                </div>
                            </div>
                        )}
                        <div
                            className={clsx(
                                message,
                                " break-words rounded-xl max-w-60 lg:max-w-sm md:max-w-sm xl:max-w-xl 2xl:max-w-2xl"
                            )}
                        >
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
                                        height={1920}
                                        width={1080}
                                        src={data.image!}
                                        className="w-full object-contain max-h-80 cursor-pointer hover:scale-125 transition translate sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm 2xl:max-w-2xl"
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
                                    <div
                                        onClick={handleDownload}
                                        className="cursor-pointer"
                                    >
                                        <div className="grid grid-cols-3 grid-rows-3 w-60 md:w-72 lg:w-80 h-24">
                                            <div className="row-span-3 justify-center ">
                                                <FileIcon
                                                    type={fileType}
                                                    className="w-full h-full cursor-pointer p-2"
                                                />
                                            </div>
                                            <div className="mt-auto mb-2 col-span-2 row-span-2">
                                                <p className="mr-2 text-sm mt-2 break-words font-semibold leading-2">
                                                    {fullFileName}
                                                </p>
                                            </div>
                                            <div className="col-span-2 row-span-3 mt-2 text-sm ">
                                                <p className="text-xs text-gray-200 mb-auto">
                                                    {fileType.toUpperCase()} •{" "}
                                                    {fileSize.size}{" "}
                                                    {fileSize.sizeType}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {data.body}
                        </div>
                        {isLast && isOwn && seenList.length > 0 && (
                            <div className="relative mt-2 text-xs font-light text-gray-500">{`Seen by ${seenList}`}</div>
                        )}
                    </div>
                </div>
            </>
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
