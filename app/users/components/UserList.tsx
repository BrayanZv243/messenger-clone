"use client";

import { User } from "@prisma/client";
import React from "react";
import UserBox from "./UserBox";
import { useSession } from "next-auth/react";
import Loading from "@/app/conversations/[conversationId]/components/Loading";
import clsx from "clsx";

interface UserListProps {
    items: User[];
}

const UserList = ({ items }: UserListProps) => {
    const session = useSession();
    return (
        <aside
            className={clsx(
                `fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block border-r border-x-gray-200 block w-full left-0`,
                session.data && "overflow-y-auto"
            )}
        >
            <div className="px-5">
                <div className="flex-col">
                    <div className="text-2xl font-bold text-neutral-800 py-4">
                        People
                    </div>
                </div>

                {items.map((item) => (
                    <UserBox key={item.id} data={item} />
                ))}
            </div>
        </aside>
    );
};

export default UserList;
