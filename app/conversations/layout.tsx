import { Conversation } from "@prisma/client";
import getConversations from "../actions/getConversations";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";
import { FullConversationType } from "../types";

export default async function ConversationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const conversations: FullConversationType[] = await getConversations();
    return (
        <Sidebar>
            <div className="h-full">
                <ConversationList initialItems={conversations} />
                {children}
            </div>
        </Sidebar>
    );
}
