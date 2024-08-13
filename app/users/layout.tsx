import { User } from "@prisma/client";
import { Suspense } from "react";
import UserList, { UserListSkeleton } from "./components/UserList";
import getUsers from "../actions/getUsers";
import Sidebar, { SidebarSkeleton } from "../components/sidebar/Sidebar";

export default async function UsersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let users: User[] = [];
    try {
        users = await getUsers();
    } catch (error) {
        console.error("Error fetching users:", error, "ERROR_LAYOUT_USERS");
        return <div>Error loading users</div>;
    }
    return (
        <Suspense fallback={<LayoutSkeleton />}>
            <Sidebar>
                <UserList items={users} />
                <div className="h-full">{children}</div>
            </Sidebar>
        </Suspense>
    );
}

const LayoutSkeleton = () => {
    return (
        <>
            <SidebarSkeleton />
            <UserListSkeleton />
        </>
    );
};
