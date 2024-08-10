import getCurrentUser from "@/app/actions/getCurrentUser";
import DesktopSidebar, {
    DesktopSidebarSkeleton,
} from "./DesktopView/DesktopSidebar";
import MobileFooter from "./MobileView/MobileFooter";

async function Sidebar({ children }: { children: React.ReactNode }) {
    const currentUser = await getCurrentUser();

    return (
        <div className="h-full">
            <DesktopSidebar currentUser={currentUser!} />
            <MobileFooter currentUser={currentUser!} />
            <main className="lg:pl-20 h-full">{children}</main>
        </div>
    );
}

export const SidebarSkeleton = () => {
    return (
        <aside className="h-full">
            <DesktopSidebarSkeleton />
        </aside>
    );
};

export default Sidebar;
