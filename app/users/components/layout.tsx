import { User } from "@prisma/client";
import Sidebar, { SidebarSkeleton } from "../../components/sidebar/Sidebar";
import getUsers from "../../actions/getUsers";
import UserList, { UserListSkeleton } from "./UserList";
import { Suspense } from "react";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const UserContent = async () => {
    try {
        const users: User[] = await getUsers();
        return <UserList items={users} />;
    } catch (error) {
        console.error("Error fetching users:", error);
        return <div>Error loading users</div>;
    }
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
