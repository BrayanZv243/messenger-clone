import { User } from "@prisma/client";
import Sidebar, { SidebarSkeleton } from "../components/sidebar/Sidebar";
import getUsers from "../actions/getUsers";
import UserList, { UserListSkeleton } from "./components/UserList";
import { Suspense } from "react";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const UserContent = async () => {
    await delay(2000);

    const users: User[] = await getUsers();
    return <UserList items={users} />;
};

export default function UsersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={<LayoutSkeleton />}>
            <Sidebar>
                <UserContent />
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
