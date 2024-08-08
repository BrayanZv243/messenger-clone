import getConversations from "../actions/getConversations";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";
import { FullConversationType } from "../types";
import getUsers from "../actions/getUsers";
import { User } from "@prisma/client";

export default async function ConversationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const conversations: FullConversationType[] = await getConversations();
    const users: User[] = await getUsers();
    return (
        <Sidebar>
            <div className="h-full">
                <ConversationList initialItems={conversations} users={users} />
                {children}
            </div>
        </Sidebar>
    );
}
