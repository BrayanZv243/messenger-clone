"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox, { ConversationBoxSkeleton } from "./ConversationBox";
import { Hint } from "@/app/components/Hint";
import { useSession } from "next-auth/react";
import Loading from "../[conversationId]/components/Loading";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

interface ConversationListProps {
    initialItems: FullConversationType[];
    users: User[];
}

const ConversationList = ({ initialItems, users }: ConversationListProps) => {
    const [items, setItems] = useState(initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const session = useSession();

    const router = useRouter();

    const { conversationId, isOpen } = useConversation();

    if (!session.data) return <ConversationListSkeleton />;

    return (
        <>
            <GroupChatModal
                users={users}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <aside
                suppressHydrationWarning
                className={clsx(
                    `fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block border-r border-gray-200`,
                    isOpen ? "hidden" : "block w-full left-0",
                    session.data && "overflow-y-auto"
                )}
            >
                <div className="px-5" suppressHydrationWarning>
                    <div className="flex justify-between mb-4 pt-4">
                        <p className="text-2xl font-bold text-neutral-800">
                            Messages
                        </p>
                        <Hint label="Create a group" side="bottom">
                            <div
                                className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <MdOutlineGroupAdd size={20} />
                            </div>
                        </Hint>
                    </div>

                    {items.map((item) => (
                        <ConversationBox
                            key={item.id}
                            data={item}
                            selected={conversationId === item.id}
                        />
                    ))}
                </div>
            </aside>
        </>
    );
};

export const ConversationListSkeleton = () => {
    return (
        <aside className="w-full fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block border-r border-gray-200">
            <div className="px-5" suppressHydrationWarning>
                <div className="flex justify-between mb-4 pt-4 gap-x-5">
                    <div className="animate-pulse rounded-lg w-2/4  bg-gray-200">
                        <Skeleton />
                    </div>

                    <div className="rounded-full p-2 bg-gray-200 cursor-pointer hover:opacity-75 transition animate-pulse">
                        <Skeleton className="h-4 w-4" />
                    </div>
                </div>

                {[...Array(4)].map((_, i) => (
                    <ConversationBoxSkeleton key={i} />
                ))}
            </div>
        </aside>
    );
};

export default ConversationList;
