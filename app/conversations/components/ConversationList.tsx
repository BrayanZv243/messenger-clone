"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox, { ConversationBoxSkeleton } from "./ConversationBox";
import { Hint } from "@/app/components/Hint";
import { useSession } from "next-auth/react";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import SettingsModal from "@/app/components/sidebar/SettingsModal";
import Avatar from "@/app/components/Avatar";
import useIsMobile from "@/app/hooks/useIsMobile";

interface ConversationListProps {
    initialItems: FullConversationType[];
    users: User[];
    currentUser: User | null;
}

const ConversationList = ({
    initialItems,
    users,
    currentUser,
}: ConversationListProps) => {
    const [items, setItems] = useState(initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpenSettings, setIsOpenSettings] = useState(false);
    const isMobile = useIsMobile();

    const session = useSession();

    const { conversationId, isOpen } = useConversation();

    const pusherKey = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email]);
    const router = useRouter();

    useEffect(() => {
        if (!pusherKey) return;
        pusherClient.subscribe(pusherKey);

        const newHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                if (find(current, { id: conversationId })) {
                    return current;
                }

                return [conversation, ...current];
            });
        };

        const updateHandler = (conversation: FullConversationType) => {
            setItems((current) =>
                current.map((currentConversation) => {
                    if (currentConversation.id === conversation.id) {
                        return {
                            ...currentConversation,
                            messages: conversation.messages,
                        };
                    }

                    return currentConversation;
                })
            );
        };

        const removeHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                return [
                    ...current.filter((conv) => conv.id !== conversationId),
                ];
            });

            if (conversationId === conversation.id)
                router.push("/conversations");
        };

        pusherClient.bind("conversation:new", newHandler);
        pusherClient.bind("conversation:update", updateHandler);
        pusherClient.bind("conversation:remove", removeHandler);

        return () => {
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unbind("conversation:new", newHandler);
            pusherClient.unbind("conversation:update", updateHandler);
            pusherClient.unbind("conversation:remove", removeHandler);
        };
    }, [pusherKey, conversationId, router]);

    if (!isMobile && !session.data) return <ConversationListSkeleton />;
    console.log(isMobile);
    if (!currentUser) {
        router.push("/");
        return;
    }
    return (
        <>
            <GroupChatModal
                users={users}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <SettingsModal
                currentUser={currentUser}
                isOpen={isOpenSettings}
                onClose={() => setIsOpenSettings(false)}
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
                        <div className="flex flex-row gap-x-4">
                            <p className="text-2xl font-bold text-neutral-800">
                                Messages
                            </p>
                            {/* Hint visible only on small screens */}
                            <div className="block lg:hidden">
                                <Hint label="Create a group" side="bottom">
                                    <div
                                        className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        <MdOutlineGroupAdd size={20} />
                                    </div>
                                </Hint>
                            </div>
                        </div>

                        {/* Hint hidden on small screens */}
                        <Hint label="Create a group" side="bottom">
                            <div
                                className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition hidden lg:block"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <MdOutlineGroupAdd size={20} />
                            </div>
                        </Hint>

                        <div
                            onClick={() => setIsOpenSettings(true)}
                            className="cursor-pointer hover:opacity-65 transition block lg:hidden"
                        >
                            <Avatar user={currentUser} />
                        </div>
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
        <aside className="hidden w-full fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block border-r border-gray-200">
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
