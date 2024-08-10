import getConversations from "../actions/getConversations";
import Sidebar, { SidebarSkeleton } from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";
import { FullConversationType } from "../types";
import getUsers from "../actions/getUsers";
import { User } from "@prisma/client";
import { Suspense } from "react";

export default async function ConversationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const conversations: FullConversationType[] = await getConversations();
    const users: User[] = await getUsers();
    return (
        <Suspense fallback={<SidebarSkeleton />}>
            <Sidebar>
                <div className="h-full">
                    <ConversationList
                        initialItems={conversations}
                        users={users}
                    />
                    {children}
                </div>
            </Sidebar>
        </Suspense>
    );
}
