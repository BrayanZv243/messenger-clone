"use client";

import { User } from "@prisma/client";
import React, { useState } from "react";
import UserBox, { UserBoxSkeleton } from "./UserBox";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { Skeleton } from "@/components/ui/skeleton";
import SettingsModal from "@/app/components/sidebar/SettingsModal";
import Avatar from "@/app/components/Avatar";
import { useRouter } from "next/navigation";

interface UserListProps {
    items: User[];
    currentUser?: User | null;
}

const UserList = ({ items, currentUser }: UserListProps) => {
    const session = useSession();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    if (!currentUser) {
        router.push("/");
        return;
    }

    return (
        <>
            <SettingsModal
                currentUser={currentUser}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
            <aside
                className={clsx(
                    `fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block border-r border-x-gray-200 block w-full left-0`,
                    session.data && "overflow-y-auto"
                )}
            >
                <div className="px-5">
                    <div className="flex flex-row items-center justify-between">
                        <div className="text-2xl font-bold text-neutral-800 py-4">
                            People
                        </div>
                        <div
                            onClick={() => setIsOpen(true)}
                            className="cursor-pointer hover:opacity-65 transition block lg:hidden"
                        >
                            <Avatar user={currentUser} />
                        </div>
                    </div>

                    {items.map((item) => (
                        <UserBox key={item.id} data={item} />
                    ))}
                </div>
            </aside>
        </>
    );
};

export const UserListSkeleton = () => {
    return (
        <aside className="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block border-r border-x-gray-200 block w-full left-0">
            <div className="px-5">
                <div className="flex-col">
                    <div className="animate-pulse rounded-lg w-2/4 mt-6 mb-4 bg-gray-200">
                        <Skeleton className="h-6" />
                    </div>
                </div>

                {[...Array(4)].map((_, i) => (
                    <UserBoxSkeleton key={i} />
                ))}
            </div>
        </aside>
    );
};

export default UserList;
