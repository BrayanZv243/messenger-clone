import getConversations from "../actions/getConversations";
import Sidebar, { SidebarSkeleton } from "../components/sidebar/Sidebar";
import ConversationList, {
    ConversationListSkeleton,
} from "./components/ConversationList";
import { FullConversationType } from "../types";
import getUsers from "../actions/getUsers";
import { User } from "@prisma/client";
import React, { Suspense } from "react";

export default async function ConversationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let conversations: FullConversationType[];
    let users: User[] = [];

    try {
        conversations = await getConversations();
        users = await getUsers();
    } catch (error) {
        console.log(error, "ERROR_LAYOUT_CONVERSATIONS");
        return <div>Internal Error</div>;
    }

    return (
        <Suspense fallback={<LayoutSkeleton />}>
            <Sidebar>
                {children}
                <ConversationList initialItems={conversations} users={users} />
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
