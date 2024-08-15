import { User } from "@prisma/client";
import { Suspense } from "react";
import UserList, { UserListSkeleton } from "./components/UserList";
import getUsers from "../actions/getUsers";
import Sidebar, { SidebarSkeleton } from "../components/sidebar/Sidebar";
import getCurrentUser from "../actions/getCurrentUser";

export default async function UsersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const users: User[] = await getUsers();
    const currentUser = await getCurrentUser();

    return (
        <Suspense fallback={<LayoutSkeleton />}>
            <Sidebar>
                <UserList items={users} currentUser={currentUser!} />
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
