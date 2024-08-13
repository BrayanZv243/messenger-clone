import getConversations from "../../actions/getConversations";
import Sidebar, { SidebarSkeleton } from "../../components/sidebar/Sidebar";
import ConversationList, { ConversationListSkeleton } from "./ConversationList";
import { FullConversationType } from "../../types";
import getUsers from "../../actions/getUsers";
import { User } from "@prisma/client";
import React, { Suspense } from "react";

const ConversationsContent = async () => {
    const conversations: FullConversationType[] = await getConversations();
    const users: User[] = await getUsers();

    return <ConversationList initialItems={conversations} users={users} />;
};

export default function ConversationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={<LayoutSkeleton />}>
            <Sidebar>
                {children}
                <ConversationsContent />
            </Sidebar>
        </Suspense>
    );
}

const LayoutSkeleton = () => {
    return (
        <>
            <SidebarSkeleton />
            <ConversationListSkeleton />
        </>
    );
};
