"use client";

import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";
import { useSession } from "next-auth/react";
import AvatarGroup from "@/app/components/AvatarGroup";
import { Skeleton } from "@/components/ui/skeleton";

interface HeaderProps {
    conversation: Conversation & {
        users: User[];
    };
}

const Header = ({ conversation }: HeaderProps) => {
    const otherUser = useOtherUser(conversation);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const session = useSession();

    const statusText = useMemo(() => {
        if (conversation.isGroup) return `${conversation.users.length} members`;

        return "Active";
    }, [conversation]);

    // Render Header Skeleton
    // if (!session.data) return;

    return (
        <>
            <ProfileDrawer
                data={conversation}
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
            <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
                <div
                    className="flex gap-3 items-center cursor-pointer"
                    onClick={() => setDrawerOpen(true)}
                >
                    <Link
                        href="/conversations"
                        className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
                    >
                        <HiChevronLeft size={32} />
                    </Link>
                    <div className="cursor-pointer hover:opacity-65 transition-opacity duration-300">
                        {conversation.isGroup ? (
                            <AvatarGroup users={conversation.users} />
                        ) : (
                            <Avatar user={otherUser} />
                        )}
                    </div>

                    <div className="flex flex-col">
                        <div>{conversation.name || otherUser.name}</div>
                        <div className="text-sm font-light text-neutral-500">
                            {statusText}
                        </div>
                    </div>
                </div>
                <HiEllipsisHorizontal
                    size={32}
                    onClick={() => setDrawerOpen(true)}
                    className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
                />
            </div>
        </>
    );
};

export const HeaderSkeleton = () => {
    return (
        <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
            <div className="flex gap-3 items-center cursor-pointer w-full gap-x-4">
                <div className="lg:hidden bg-gray-200 w-12 h-8 rounded-lg animate-pulse">
                    <Skeleton />
                </div>
                <div className="bg-gray-200 rounded-full w-16 h-10 md:w-16 md:h-12 xl:w-12 xl:h-11 lg:w-14 lg:h-12  animate-pulse">
                    <Skeleton />
                </div>

                <div className="flex flex-col w-full animate-pulse">
                    <div className="bg-gray-200 w-2/4 lg:w-2/12 xl:2/12 h-5 rounded-md">
                        <Skeleton />
                    </div>
                    <div className="bg-gray-200 w-1/3 h-5 lg:w-1/12 xl:w-1/12 rounded-md mt-2">
                        <Skeleton />
                    </div>
                </div>
            </div>
            <div className="w-8 animate-pulse bg-sky-200 h-6 rounded-lg">
                <Skeleton />
            </div>
        </div>
    );
};

export default Header;
