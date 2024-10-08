import getConversations from "../actions/getConversations";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";
import { FullConversationType } from "../types";
import getUsers from "../actions/getUsers";
import { User } from "@prisma/client";
import React from "react";
import getCurrentUser from "../actions/getCurrentUser";

export default async function ConversationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let conversations: FullConversationType[];
    let users: User[] = [];
    let currentUser: User | null;

    try {
        conversations = await getConversations();
        users = await getUsers();
        currentUser = await getCurrentUser();
    } catch (error) {
        console.log(error, "ERROR_LAYOUT_CONVERSATIONS");
        return <div>Internal Error</div>;
    }

    return (
        <Sidebar>
            {children}
            <ConversationList
                initialItems={conversations}
                users={users}
                currentUser={currentUser}
            />
        </Sidebar>
    );
}
