"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { FullConversationType } from "@/app/types";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import { Skeleton } from "@/components/ui/skeleton";

interface ConversationBoxProps {
    data: FullConversationType;
    selected?: boolean;
}

const ConversationBox = ({ data, selected }: ConversationBoxProps) => {
    const otherUser = useOtherUser(data);
    const session = useSession();
    const router = useRouter();

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`);
    }, [data.id, router]);

    const lastMessage = useMemo(() => {
        const messages = data.messages || [];
        return messages[messages.length - 1];
    }, [data.messages]);

    const userEmail = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email]);

    const hasSeen = useMemo(() => {
        if (!lastMessage) return false;

        const seenArray = lastMessage.seen || [];

        if (!userEmail) return false;

        return (
            seenArray.filter((user) => user.email === userEmail).length !== 0
        );
    }, [userEmail, lastMessage]);

    const lastMessageText = useMemo(() => {
        if (lastMessage?.image) return "Sent an image";

        if (lastMessage?.body) return lastMessage.body;

        return "Started a conversation";
    }, [lastMessage]);

    return (
        <div
            suppressHydrationWarning
            onClick={handleClick}
            className={clsx(
                `w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer p-3 mt-2`,
                selected ? "bg-neutral-100" : "bg-white"
            )}
        >
            {data.isGroup ? (
                <AvatarGroup users={data.users} />
            ) : (
                <Avatar user={otherUser} />
            )}
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <div className="flex justify-between mb-0">
                        <p className="truncate w-full text-md font-medium text-gray-900">
                            {data.name || otherUser.name || ""}
                        </p>
                        {lastMessage?.createdAt && (
                            <div className="text-xs text-gray-400 font-light font-mono w-20 flex justify-end">
                                {format(new Date(lastMessage.createdAt), "p")}
                            </div>
                        )}
                    </div>
                    <p
                        className={clsx(
                            `truncate text-sm`,
                            hasSeen ? "text-gray-500" : "text-black font-medium"
                        )}
                    >
                        {lastMessageText}
                    </p>
                </div>
            </div>
        </div>
    );
};

export const ConversationBoxSkeleton = () => {
    return (
        <div className="w-full relative flex items-center space-x-3 rounded-lg p-3">
            <div className="animate-pulse rounded-full bg-gray-200">
                <Skeleton className="w-12 h-12" /> {/* AVATAR */}
            </div>
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <div className="flex justify-between mb-0">
                        <div className="bg-gray-200 rounded-md w-2/3 animate-pulse">
                            <Skeleton className="w-full h-5" /> {/* NAME */}
                        </div>
                        <div className="bg-gray-200 rounded-md flex justify-end w-12 h-3 animate-pulse">
                            <Skeleton /> {/* HOUR */}
                        </div>
                    </div>
                    <div className="animate-pulse bg-gray-200 rounded-md w-1/2 mt-2 border`">
                        <Skeleton className="w-full h-2" /> {/* LAST MESSAGE */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConversationBox;
