"use client";

import { usePathname } from "next/navigation";
import { DesktopSidebarSkeleton } from "./components/sidebar/DesktopView/DesktopSidebar";
import { MobileFooterSkeleton } from "./components/sidebar/MobileView/MobileFooter";
import { UserListSkeleton } from "./users/components/UserList";
import { ConversationListSkeleton } from "./conversations/components/ConversationList";
import ModalLoading from "./components/Modal-Loading";

const Loading = () => {
    const pathname = usePathname();
    const isUsers = pathname?.startsWith("/users");
    const isConversations = pathname?.startsWith("/conversations");
    const none = !isConversations && !isUsers;

    return (
        <>
            {none && <ModalLoading />}
            {isUsers && <UserListSkeleton />}
            {isConversations && <ConversationListSkeleton />}
            <DesktopSidebarSkeleton />
            <MobileFooterSkeleton />
        </>
    );
};

export default Loading;
